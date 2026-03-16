#!/usr/bin/env node

/**
 * Quick connectivity test for Hotelbeds / Bedsonline API (sandbox).
 * Run:  node scripts/test-hotelbeds.mjs
 */

const API_KEY = process.env.HOTELBEDS_API_KEY ?? "dc6bc67395b243962104033bba528524";
const SECRET  = process.env.HOTELBEDS_SECRET  ?? "1b272df295";
const BASE    = process.env.HOTELBEDS_BASE_URL ?? "https://api.test.hotelbeds.com/hotel-api/1.0";

async function generateSignature() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const raw = API_KEY + SECRET + timestamp;
  const data = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function testStatus() {
  console.log("=== Hotelbeds / Bedsonline Connectivity Test ===\n");
  console.log(`Base URL : ${BASE}`);
  console.log(`API Key  : ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
  console.log();

  const sig = await generateSignature();

  const headers = {
    "Api-key": API_KEY,
    "X-Signature": sig,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // --- Test 1: Hotel status/check-rate endpoint (lightweight) ---
  console.log("1) Testing GET /status ...");
  try {
    const res = await fetch(`${BASE}/status`, { headers });
    console.log(`   HTTP ${res.status} ${res.statusText}`);
    if (res.ok) {
      console.log("   ✅ API is reachable and credentials are valid.\n");
    } else {
      const body = await res.text();
      console.log(`   ❌ Response: ${body}\n`);
    }
  } catch (err) {
    console.log(`   ❌ Network error: ${err.message}\n`);
  }

  // --- Test 2: Minimal hotel availability search ---
  console.log("2) Testing POST /hotels (availability search, Cancún) ...");

  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 30);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 3);

  const fmt = (d) => d.toISOString().split("T")[0];

  const body = {
    stay: { checkIn: fmt(checkIn), checkOut: fmt(checkOut) },
    occupancies: [{ rooms: 1, adults: 2, children: 0 }],
    filter: { maxHotels: 5 },
    destination: { code: "CUN" },
  };

  const sig2 = await generateSignature();
  headers["X-Signature"] = sig2;

  try {
    const res = await fetch(`${BASE}/hotels`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log(`   HTTP ${res.status} ${res.statusText}`);

    if (res.ok) {
      const data = await res.json();
      const hotels = data.hotels?.hotels ?? [];
      console.log(`   ✅ Returned ${hotels.length} hotel(s).`);
      if (hotels.length > 0) {
        console.log("\n   Sample results:");
        hotels.slice(0, 3).forEach((h, i) => {
          console.log(`     ${i + 1}. ${h.name} — ${h.minRate} ${h.currency}`);
        });
      }
    } else {
      const text = await res.text();
      console.log(`   ❌ Error body: ${text.slice(0, 500)}`);
    }
  } catch (err) {
    console.log(`   ❌ Network error: ${err.message}`);
  }

  console.log("\n=== Done ===");
}

testStatus();
