import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, stepCountIs, convertToModelMessages } from "ai";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendQuoteNotification } from "@/lib/services/email";
import { getApiKey } from "@/lib/cms/api-keys";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a friendly and professional travel advisor for Viaja Agencia, a premium travel agency in León, Guanajuato, Mexico with over 20 years of experience. You have IATA certification.

Your goal is to help clients plan their dream trip and collect information for a quote request. Be warm, enthusiastic, and knowledgeable about travel.

CONVERSATION FLOW:
1. Greet warmly and ask about their dream destination
2. Ask about travel dates (when they want to go)
3. Ask about travelers (how many adults and children)
4. Ask about their travel style/preferences (honeymoon, family, adventure, etc.)
5. Ask about budget range
6. When you have enough info (at least destination + dates + name + email), use the submit_quote tool to save the request

IMPORTANT RULES:
- Respond in the SAME LANGUAGE the user writes in (Spanish or English)
- Be concise but friendly (2-3 sentences max per response)
- Suggest popular destinations if they're unsure: Cancún, Europa, Japón, Maldivas, etc.
- Always ask for their name and email before submitting a quote
- After submitting, confirm and let them know the team will contact them within 24 hours
- You can answer general questions about Viaja Agencia: they're located at Nube #522, Col. Jardines del Moral, León, GTO. Phone: 477-779-0610. Email: reservaciones@viajaagencia.com.mx

SERVICES OFFERED:
- Hotel reservations worldwide (via Hotelbeds/Bedsonline)
- Travel packages (via Megatravel)
- Flights and bus tickets
- Tours and excursions
- Car rentals and transfers
- Honeymoon & destination weddings
- Group trips
- Corporate travel`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = await getApiKey("openai_api_key");
  if (!apiKey) {
    return new Response("OpenAI API key not configured", { status: 503 });
  }
  const openai = createOpenAI({ apiKey });

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    tools: {
      submit_quote: tool({
        description:
          "Submit a quote request when you have collected enough travel information from the user. Call this when you have at least the client name, email, and destination.",
        inputSchema: z.object({
          clientName: z.string().describe("Client full name"),
          clientEmail: z.string().email().describe("Client email address"),
          clientPhone: z
            .string()
            .optional()
            .describe("Client phone number"),
          destination: z
            .string()
            .optional()
            .describe("Travel destination"),
          travelType: z
            .string()
            .optional()
            .describe(
              "Type of trip: honeymoon, family, adventure, group, corporate, cruise, all-inclusive, custom"
            ),
          checkIn: z
            .string()
            .optional()
            .describe("Check-in date in YYYY-MM-DD format"),
          checkOut: z
            .string()
            .optional()
            .describe("Check-out date in YYYY-MM-DD format"),
          adults: z
            .number()
            .optional()
            .describe("Number of adult travelers"),
          children: z
            .number()
            .optional()
            .describe("Number of children"),
          budgetRange: z.string().optional().describe("Budget range"),
          preferredLocale: z.string().optional().describe("Client preferred language: es or en"),
          notes: z
            .string()
            .optional()
            .describe("Additional notes or special requests"),
        }),
        execute: async (params) => {
          try {
            const supabase = createAdminClient();
            const { error } = await supabase.from("quote_requests").insert({
              source: "chatbot",
              status: "nueva",
              client_name: params.clientName,
              client_email: params.clientEmail,
              client_phone: params.clientPhone || null,
              destination: params.destination || null,
              travel_type: params.travelType || null,
              check_in: params.checkIn || null,
              check_out: params.checkOut || null,
              adults: params.adults || 2,
              children: params.children || 0,
              budget_range: params.budgetRange || null,
              notes: params.notes || null,
              preferred_locale: params.preferredLocale || "es",
            });

            if (error) {
              console.error("Quote insert error:", error);
              return { success: false, message: "Error saving quote" };
            }

            await sendQuoteNotification({
              clientName: params.clientName,
              clientEmail: params.clientEmail,
              clientPhone: params.clientPhone,
              destination: params.destination,
              travelType: params.travelType,
              checkIn: params.checkIn,
              checkOut: params.checkOut,
              adults: params.adults,
              children: params.children,
              budgetRange: params.budgetRange,
              notes: params.notes,
              source: "chatbot",
            });

            return {
              success: true,
              message: "Quote request saved and team notified",
            };
          } catch (e) {
            console.error("Quote submission error:", e);
            return { success: false, message: "Error submitting quote" };
          }
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
