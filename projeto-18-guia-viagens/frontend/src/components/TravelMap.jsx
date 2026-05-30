import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCoords } from "../utils/coords";
import { getFlagEmoji, formatCountryName, formatTitleCase } from "../utils/flags";

const travelIcon = L.divIcon({
  className: "travel-marker-icon",
  html: '<span class="travel-marker"></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -18],
});

export default function TravelMap({ destinations, onSelect, height = "520px" }) {
  const withCoords = destinations.filter((destination) => getCoords(destination));
  const ordered = [...withCoords].sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));
  const polyline = ordered.map((destination) => getCoords(destination));
  const bounds = ordered.length > 1 ? ordered.map(getCoords) : null;

  const center = bounds ? bounds[0] : withCoords[0] || [39.5, -8.0];

  return (
    <div className="travel-map-wrapper" style={{ height }}>
      <div className="travel-map-card">
        <div>
          <strong>{destinations.length} destinos</strong>
          <p>Visão de viagem com rota e pontos destacados.</p>
        </div>
      </div>
      <MapContainer
        center={center}
        zoom={withCoords.length === 1 ? 7 : 3}
        bounds={bounds || undefined}
        boundsOptions={{ padding: [70, 70] }}
        className="travel-leaflet-map"
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='Map tiles by <a href="https://stamen.com">Stamen Design</a>, data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
        />
        {ordered.map((destination, index) => {
          const position = getCoords(destination);
          return (
            <Marker
              key={destination.id}
              position={position}
              icon={travelIcon}
              eventHandlers={{ click: () => onSelect?.(destination) }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                <span className="travel-tooltip">
                  {index + 1}. {formatTitleCase(destination.city)}, {formatCountryName(destination.country)}
                </span>
              </Tooltip>
              <Popup className="travel-popup">
                <strong>
                  {getFlagEmoji(destination.country)} {formatCountryName(destination.country)} • {formatTitleCase(destination.city)}
                </strong>
                {destination.visit_date && (
                  <p>{new Date(destination.visit_date).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}</p>
                )}
                {destination.description && <p>{destination.description}</p>}
              </Popup>
            </Marker>
          );
        })}
        {polyline.length > 1 && (
          <Polyline pathOptions={{ color: "#b85c38", weight: 4, opacity: 0.8, dashArray: "8,8" }} positions={polyline} />
        )}
      </MapContainer>
    </div>
  );
}
