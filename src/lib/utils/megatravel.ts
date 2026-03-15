export interface MegatravelDestination {
  id: number;
  nameEs: string;
  nameEn: string;
  icon: string;
}

export const MEGATRAVEL_DESTINATIONS: MegatravelDestination[] = [
  { id: 1, nameEs: "Europa", nameEn: "Europe", icon: "🏰" },
  { id: 2, nameEs: "Medio Oriente", nameEn: "Middle East", icon: "🕌" },
  { id: 3, nameEs: "Canadá", nameEn: "Canada", icon: "🍁" },
  { id: 4, nameEs: "Asia", nameEn: "Asia", icon: "🏯" },
  { id: 5, nameEs: "África", nameEn: "Africa", icon: "🦁" },
  { id: 6, nameEs: "Pacífico", nameEn: "Pacific", icon: "🏝️" },
  { id: 7, nameEs: "Sudamérica", nameEn: "South America", icon: "🌎" },
  { id: 8, nameEs: "Estados Unidos", nameEn: "United States", icon: "🗽" },
  { id: 9, nameEs: "Centroamérica", nameEn: "Central America", icon: "🌴" },
  { id: 10, nameEs: "Cuba y el Caribe", nameEn: "Cuba & Caribbean", icon: "🌊" },
  { id: 11, nameEs: "Nacionales", nameEn: "Domestic", icon: "🇲🇽" },
  { id: 12, nameEs: "Eventos Especiales", nameEn: "Special Events", icon: "🎉" },
  { id: 13, nameEs: "Cruceros", nameEn: "Cruises", icon: "🚢" },
  { id: 14, nameEs: "Juventud Viajera", nameEn: "Youth Travel", icon: "🎒" },
  { id: 15, nameEs: "Exóticos", nameEn: "Exotic", icon: "✨" },
];

const VIAJA_PARAMS_VI: Record<string, string> = {
  txtColor: "35322C",
  thBG: "062D97",
  thTxColor: "FFFFFF",
  aColor: "2667FF",
  ahColor: "1DCEC8",
  ff: "9",
};

const VIAJA_PARAMS_OFERTAS: Record<string, string> = {
  txtColor: "35322C",
  lblTPaq: "062D97",
  lblTRange: "6B7280",
  lblNumRange: "2667FF",
  itemBack: "FAFBFF",
  ItemHov: "062D97",
  txtColorHov: "FFFFFF",
  ff: "9",
};

function buildParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

export function getMegatravelDestUrl(destId: number): string {
  return `https://www.megatravel.com.mx/tools/vi.php?Dest=${destId}&${buildParams(VIAJA_PARAMS_VI)}`;
}

export function getMegatravelOfertasUrl(): string {
  return `https://www.megatravel.com.mx/tools/ofertas-viaje.php?Dest=&${buildParams(VIAJA_PARAMS_OFERTAS)}`;
}

export function getMegatravelCrucerosUrl(): string {
  return `https://www.megatravel.com.mx/tools/cruceros.php?${buildParams(VIAJA_PARAMS_VI)}`;
}
