const COUNTRY_CODE_MAP = {
  afeganistao: "AF",
  africadosul: "ZA",
  alemanha: "DE",
  austria: "AT",
  australia: "AU",
  belgica: "BE",
  brasil: "BR",
  canada: "CA",
  chile: "CL",
  china: "CN",
  dinamarca: "DK",
  espanha: "ES",
  estonia: "EE",
  finlandia: "FI",
  franca: "FR",
  grecia: "GR",
  holanda: "NL",
  hungria: "HU",
  india: "IN",
  indonesia: "ID",
  irlanda: "IE",
  islandia: "IS",
  israel: "IL",
  italia: "IT",
  japao: "JP",
  luxemburgo: "LU",
  mexico: "MX",
  monaco: "MC",
  noruega: "NO",
  novazelandia: "NZ",
  paisesbaixos: "NL",
  paisbaixos: "NL",
  portugal: "PT",
  reinounido: "GB",
  unitedkingdom: "GB",
  uk: "GB",
  unitedstates: "US",
  usa: "US",
  eua: "US",
  estadosunidos: "US",
  suica: "CH",
  suecia: "SE",
  sulafrica: "ZA",
  suidafrica: "ZA",
  turquia: "TR",
  tunisia: "TN",
  ucrania: "UA",
  uae: "AE",
  uzbequistao: "UZ",
  vietnam: "VN",
  argentina: "AR",
  bangladesh: "BD",
  belarus: "BY",
  bolivia: "BO",
  botsuana: "BW",
  cambodja: "KH",
  camarao: "CM",
  camerun: "CM",
  costarica: "CR",
  cuba: "CU",
  egito: "EG",
  emirados: "AE",
  equador: "EC",
  ethiopia: "ET",
  filipinas: "PH",
  georgia: "GE",
  guatemala: "GT",
  honduras: "HN",
  jamaica: "JM",
  coreia: "KR",
  coreiadosul: "KR",
  korea: "KR",
  koweit: "KW",
  kuwait: "KW",
  letonia: "LV",
  lituania: "LT",
  malasia: "MY",
  moldova: "MD",
  mongolia: "MN",
  marrocos: "MA",
  netherlands: "NL",
  nepal: "NP",
  niger: "NE",
  nigeria: "NG",
  panama: "PA",
  paraguai: "PY",
  peru: "PE",
  polonia: "PL",
  qatar: "QA",
  romenia: "RO",
  russia: "RU",
  rwanda: "RW",
  senegal: "SN",
  serbia: "RS",
  singapura: "SG",
  sudao: "SD",
  tailandia: "TH",
  turkey: "TR",
  uganda: "UG",
  uruguai: "UY",
  uzbekistao: "UZ",
  venezuela: "VE",
  zambia: "ZM",
  zimbabue: "ZW",
};

function normalizeCountry(raw) {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/ /g, "");
}

function toFlagEmoji(code) {
  if (!code || code.length !== 2) return "";
  const first = code.codePointAt(0);
  const second = code.codePointAt(1);
  if (!first || !second) return "";
  return String.fromCodePoint(0x1f1e6 + first - 65, 0x1f1e6 + second - 65);
}

export function formatTitleCase(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatCountryName(country) {
  return formatTitleCase(country);
}

export function getFlagEmoji(country) {
  if (!country || typeof country !== "string") return "";
  const normalized = normalizeCountry(country);
  const fallback = COUNTRY_CODE_MAP[normalized];
  if (fallback) return toFlagEmoji(fallback);

  if (normalized.length === 2 && /^[a-z]{2}$/.test(normalized)) {
    return toFlagEmoji(normalized.toUpperCase());
  }

  return "";
}
