const CITY_COORDS = {
  Lisboa: [38.7223, -9.1393],
  Porto: [41.1579, -8.6291],
  Paris: [48.8566, 2.3522],
  Londres: [51.5074, -0.1278],
  Madrid: [40.4168, -3.7038],
  Roma: [41.9028, 12.4964],
  Barcelona: [41.3851, 2.1734],
  Palma_de_Mallorca: [39.5696, -2.6502],
  Palma_de_Maiorca: [39.5696, -2.6502],
  Palma: [39.5696, -2.6502],
  Berlim: [52.52, 13.405],
  Amesterdão: [52.3676, 4.9041],
  Nova_York: [40.7128, -74.006],
  Tóquio: [35.6762, 139.6503],
  Sydney: [-33.8688, 151.2093],
  Rio_de_Janeiro: [-22.9068, -43.1729],
  Bangkok: [13.7563, 100.5018],
  Dubai: [25.2048, 55.2708],
};

const COUNTRY_COORDS = {
  Portugal: [39.5, -8.0],
  Espanha: [40.4, -3.7],
  França: [46.2, 2.2],
  Itália: [41.9, 12.6],
  Alemanha: [51.2, 10.5],
  "Reino Unido": [55.4, -3.4],
  Brasil: [-14.2, -51.9],
  "Estados Unidos": [37.1, -95.7],
  Japão: [36.2, 138.3],
  Marrocos: [31.8, -7.1],
  Grécia: [39.1, 21.8],
  Tailândia: [15.9, 100.9],
};

function normalizeKey(value) {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-’'`]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

const NORMALIZED_CITY_COORDS = Object.fromEntries(
  Object.entries(CITY_COORDS).map(([city, coords]) => [normalizeKey(city), coords])
);

const NORMALIZED_COUNTRY_COORDS = Object.fromEntries(
  Object.entries(COUNTRY_COORDS).map(([country, coords]) => [normalizeKey(country), coords])
);

export function getCoords(destination) {
  const hasLatitude = destination.latitude !== undefined && destination.latitude !== null && destination.latitude !== "";
  const hasLongitude = destination.longitude !== undefined && destination.longitude !== null && destination.longitude !== "";

  if (hasLatitude && hasLongitude) {
    const lat = parseFloat(destination.latitude);
    const lng = parseFloat(destination.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [lat, lng];
    }
  }

  const cityKey = normalizeKey(destination.city);
  if (cityKey && NORMALIZED_CITY_COORDS[cityKey]) return NORMALIZED_CITY_COORDS[cityKey];

  const countryKey = normalizeKey(destination.country);
  if (countryKey && NORMALIZED_COUNTRY_COORDS[countryKey]) return NORMALIZED_COUNTRY_COORDS[countryKey];

  return null;
}
