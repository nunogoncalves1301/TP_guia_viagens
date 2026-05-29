import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCoords } from "../utils/coords";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl: iconRetina,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

export default function MapView({ destinations, onSelect, height = "480px" }) {
  const withCoords = destinations.filter((d) => getCoords(d));

  const center =
    withCoords.length > 0
      ? getCoords(withCoords[0])
      : [39.5, -8.0];

  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer center={center} zoom={withCoords.length === 1 ? 8 : 3} className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destinations.map((d) => {
          const pos = getCoords(d);
          return (
            <Marker key={d.id} position={pos} eventHandlers={{ click: () => onSelect?.(d) }}>
              <Popup>
                <strong>
                  {d.city}, {d.country}
                </strong>
                {d.rating && <p>★ {d.rating}/5</p>}
                {d.author_name && <p>por {d.author_name}</p>}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
