import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCoords } from "../utils/coords";
import { getFlagEmoji, formatCountryName } from "../utils/flags";

const createPinIcon = (index) =>
  L.divIcon({
    className: "",
    html: `
      <div class="map-pin-wrapper">
        <div class="map-pin">
          ${index !== undefined ? `<span class="map-pin-number">${index + 1}</span>` : `<span class="map-pin-dot"></span>`}
        </div>
        <div class="map-pin-shadow"></div>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });

export default function MapView({ destinations, onSelect, height = "480px" }) {
  const withCoords = destinations
    .map((d) => ({ ...d, coords: getCoords(d) }))
    .filter((d) => d.coords);

  const center = withCoords.length > 0 ? withCoords[0].coords : [39.5, -8.0];

  return (
    <>
      <style>{`
        .map-pin-wrapper { display: flex; flex-direction: column; align-items: center; }
        .map-pin {
          width: 36px; height: 36px;
          background: #b85c38;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex; align-items: center; justify-content: center;
          border: 2.5px solid #fff;
          box-shadow: 0 2px 8px rgba(184,92,56,0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .map-pin:hover { transform: rotate(-45deg) scale(1.15); box-shadow: 0 4px 16px rgba(184,92,56,0.6); }
        .map-pin-dot {
          width: 10px; height: 10px;
          background: #fff; border-radius: 50%;
          transform: rotate(45deg);
        }
        .map-pin-number {
          color: #fff; font-size: 12px; font-weight: 700;
          transform: rotate(45deg); line-height: 1;
        }
        .map-pin-shadow {
          width: 10px; height: 5px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          margin-top: 2px;
          filter: blur(2px);
        }
        .leaflet-popup-content-wrapper {
          background: #fdf8f3 !important;
          border-radius: 12px !important;
          border: 1.5px solid #e8d5c4 !important;
          box-shadow: 0 8px 32px rgba(28,24,20,0.15) !important;
          padding: 0 !important;
          animation: popupIn 0.2s ease;
        }
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .leaflet-popup-content { margin: 0 !important; padding: 14px 16px !important; min-width: 180px; }
        .leaflet-popup-tip { background: #fdf8f3 !important; }
        .leaflet-popup-close-button { color: #b85c38 !important; font-size: 18px !important; top: 8px !important; right: 10px !important; }
        .map-popup-title { font-size: 14px; font-weight: 700; color: #1c1814; margin-bottom: 4px; }
        .map-popup-date { font-size: 12px; color: #8f6a52; margin-bottom: 4px; }
        .map-popup-rating { color: #c9a227; font-size: 13px; }
        .map-popup-author { font-size: 12px; color: #8f6a52; margin-top: 4px; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 12px rgba(28,24,20,0.12) !important; border-radius: 10px !important; overflow: hidden; }
        .leaflet-control-zoom a {
          background: #fdf8f3 !important; color: #b85c38 !important;
          border: none !important; font-size: 18px !important;
          width: 34px !important; height: 34px !important; line-height: 34px !important;
          transition: background 0.15s;
        }
        .leaflet-control-zoom a:hover { background: #f0e4d4 !important; }
        .map-wrapper { border-radius: 14px; overflow: hidden; border: 1.5px solid #e8d5c4; box-shadow: 0 4px 24px rgba(28,24,20,0.1); }
      `}</style>
      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          center={center}
          zoom={withCoords.length === 1 ? 8 : 3}
          className="leaflet-map"
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {withCoords.map((d) => (
            <Marker
              key={d.id}
              position={d.coords}
              icon={createPinIcon()}
              eventHandlers={{ click: () => onSelect?.(d) }}
            >
              <Popup>
                <div className="map-popup-title">
                  {getFlagEmoji(d.country)} {formatCountryName(d.country)} • {d.city?.trim()}
                </div>
                {d.visit_date && (
                  <div className="map-popup-date">
                    {new Date(d.visit_date).toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
                  </div>
                )}
                {d.rating && (
                  <div className="map-popup-rating">{"★".repeat(d.rating)}{"☆".repeat(5 - d.rating)} {d.rating}/5</div>
                )}
                {d.author_name && <div className="map-popup-author">por {d.author_name}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
