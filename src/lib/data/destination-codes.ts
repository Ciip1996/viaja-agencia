// Maps lowercase city/country names and common aliases to Hotelbeds destination codes.
// Hotelbeds uses IATA airport codes for most beach/city destinations.
// Shared between src/lib/services/hotelbeds.ts and src/app/api/destinations/route.ts.

export const DESTINATION_CODES: Record<string, string> = {
  // Mexico
  cancun: "CUN",
  "cancún": "CUN",
  "riviera maya": "CUN",
  "playa del carmen": "CUN",
  tulum: "CUN",
  "mexico city": "MEX",
  "ciudad de mexico": "MEX",
  cdmx: "MEX",
  guadalajara: "GDL",
  monterrey: "MTY",
  oaxaca: "OAX",
  "los cabos": "SJD",
  "cabo san lucas": "SJD",
  mazatlan: "MZT",
  "mazatlán": "MZT",
  "puerto vallarta": "PVR",
  huatulco: "HUX",
  merida: "MID",
  "mérida": "MID",

  // United States
  "united states": "MIA",
  usa: "MIA",
  "estados unidos": "MIA",
  "new york": "JFK",
  "nueva york": "JFK",
  miami: "MIA",
  "los angeles": "LAX",
  "las vegas": "LAS",
  orlando: "MCO",
  chicago: "ORD",
  "san francisco": "SFO",
  hawaii: "HNL",
  honolulu: "HNL",
  boston: "BOS",
  washington: "IAD",

  // Canada
  canada: "YVR",
  "canadá": "YVR",
  toronto: "YYZ",
  vancouver: "YVR",
  montreal: "YUL",
  calgary: "YYC",
  ottawa: "YOW",

  // Europe
  europe: "MAD",
  europa: "MAD",
  spain: "MAD",
  "españa": "MAD",
  madrid: "MAD",
  barcelona: "BCN",
  seville: "SVQ",
  sevilla: "SVQ",
  france: "CDG",
  francia: "CDG",
  paris: "CDG",
  nice: "NCE",
  italy: "FCO",
  italia: "FCO",
  rome: "FCO",
  roma: "FCO",
  milan: "MXP",
  "milán": "MXP",
  venice: "VCE",
  venecia: "VCE",
  florence: "FLR",
  florencia: "FLR",
  naples: "NAP",
  napoles: "NAP",
  santorini: "JTR",
  mykonos: "JMK",
  athens: "ATH",
  atenas: "ATH",
  greece: "ATH",
  grecia: "ATH",
  london: "LHR",
  londres: "LHR",
  uk: "LHR",
  "united kingdom": "LHR",
  "reino unido": "LHR",
  amsterdam: "AMS",
  netherlands: "AMS",
  "países bajos": "AMS",
  portugal: "LIS",
  lisbon: "LIS",
  lisboa: "LIS",
  germany: "FRA",
  alemania: "FRA",
  frankfurt: "FRA",
  berlin: "BER",
  "berlín": "BER",
  munich: "MUC",
  "múnich": "MUC",
  croatia: "DBV",
  croacia: "DBV",
  dubrovnik: "DBV",
  prague: "PRG",
  praga: "PRG",
  vienna: "VIE",
  viena: "VIE",
  zurich: "ZRH",
  "zúrich": "ZRH",
  switzerland: "ZRH",
  suiza: "ZRH",
  stockholm: "ARN",
  estocolmo: "ARN",
  sweden: "ARN",
  suecia: "ARN",
  copenhagen: "CPH",
  copenhague: "CPH",
  denmark: "CPH",
  dinamarca: "CPH",

  // Middle East
  "middle east": "DXB",
  "medio oriente": "DXB",
  dubai: "DXB",
  "abu dhabi": "AUH",
  uae: "DXB",
  emiratos: "DXB",
  istanbul: "IST",
  turkey: "IST",
  "turquía": "IST",
  jordan: "AMM",
  jordania: "AMM",

  // Asia
  asia: "BKK",
  tokyo: "NRT",
  tokio: "NRT",
  japan: "NRT",
  japon: "NRT",
  osaka: "KIX",
  kyoto: "KIX",
  bangkok: "BKK",
  thailand: "BKK",
  tailandia: "BKK",
  bali: "DPS",
  indonesia: "DPS",
  singapore: "SIN",
  singapur: "SIN",
  "hong kong": "HKG",
  beijing: "PEK",
  pekin: "PEK",
  shanghai: "PVG",
  seoul: "ICN",
  seul: "ICN",
  "south korea": "ICN",
  "corea del sur": "ICN",
  maldives: "MLE",
  maldivas: "MLE",
  india: "DEL",
  "new delhi": "DEL",
  "nueva delhi": "DEL",
  mumbai: "BOM",

  // South America
  "south america": "GRU",
  sudamerica: "GRU",
  "sudamérica": "GRU",
  brazil: "GRU",
  brasil: "GRU",
  "sao paulo": "GRU",
  "são paulo": "GRU",
  "rio de janeiro": "GIG",
  rio: "GIG",
  argentina: "EZE",
  "buenos aires": "EZE",
  colombia: "BOG",
  bogota: "BOG",
  "bogotá": "BOG",
  peru: "LIM",
  "perú": "LIM",
  lima: "LIM",
  chile: "SCL",
  santiago: "SCL",
  ecuador: "UIO",
  quito: "UIO",

  // Central America & Caribbean
  "central america": "SJO",
  centroamerica: "SJO",
  "centroamérica": "SJO",
  "costa rica": "SJO",
  "san jose": "SJO",
  panama: "PTY",
  "panamá": "PTY",
  cuba: "HAV",
  "la habana": "HAV",
  havana: "HAV",
  caribbean: "SJU",
  caribe: "SJU",
  "puerto rico": "SJU",
  "dominican republic": "SDQ",
  "republica dominicana": "SDQ",
  "punta cana": "PUJ",
  jamaica: "KIN",

  // Africa
  africa: "CMN",
  "áfrica": "CMN",
  morocco: "CMN",
  marruecos: "CMN",
  marrakech: "RAK",
  marrakesh: "RAK",
  egypt: "CAI",
  egipto: "CAI",
  cairo: "CAI",
  "el cairo": "CAI",
  "south africa": "JNB",
  sudafrica: "JNB",
  "sudáfrica": "JNB",
  johannesburg: "JNB",
  capetown: "CPT",
  "cape town": "CPT",
  "ciudad del cabo": "CPT",
  kenya: "NBO",
  nairobi: "NBO",
  tanzania: "JRO",
  zanzibar: "ZNZ",
  mauritius: "MRU",
  mauricio: "MRU",

  // Pacific
  pacific: "SYD",
  pacifico: "SYD",
  "pacífico": "SYD",
  australia: "SYD",
  sydney: "SYD",
  melbourne: "MEL",
  "new zealand": "AKL",
  "nueva zelanda": "AKL",
  auckland: "AKL",
  fiji: "NAN",
  fiyi: "NAN",
};

/**
 * Resolves a free-text destination query to a Hotelbeds destination code.
 * Returns null if no match is found.
 */
export function resolveDestinationCode(query: string): string | null {
  const key = query.trim().toLowerCase();
  if (DESTINATION_CODES[key]) return DESTINATION_CODES[key];
  for (const [alias, code] of Object.entries(DESTINATION_CODES)) {
    if (alias.includes(key) || key.includes(alias)) return code;
  }
  return null;
}

export interface DestinationSuggestion {
  name: string;
  code: string;
}

/**
 * Returns up to `limit` destination suggestions matching the query.
 * Deduplicates by code, preferring the canonical (title-cased) name.
 */
export function searchDestinations(
  query: string,
  limit = 8
): DestinationSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const seen = new Set<string>();
  const results: DestinationSuggestion[] = [];

  for (const [alias, code] of Object.entries(DESTINATION_CODES)) {
    if (results.length >= limit) break;
    if (!alias.includes(q) && !q.includes(alias)) continue;
    if (seen.has(`${alias}-${code}`)) continue;
    seen.add(`${alias}-${code}`);
    // Title-case the alias for display
    const name = alias
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    results.push({ name, code });
  }

  return results;
}
