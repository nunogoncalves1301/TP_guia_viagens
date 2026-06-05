import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { getCoords } from "../utils/coords";
import { getFlagEmoji, formatCountryName, formatTitleCase } from "../utils/flags";

const createPinIcon = (index) =>
  L.divIcon({
    className: "",
    html: `
      <div class="tm-pin-wrapper">
        <div class="tm-pin">
          <span class="tm-pin-number">${index + 1}</span>
        </div>
        <div class="tm-pin-shadow"></div>
      </div>
    `,
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -48],
  });

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1.2 });
    }
  }, [map, bounds]);
  return null;
}

export default function TravelMap({ destinations, onSelect, height = "520px" }) {
  const withCoords = destinations.filter((d) => getCoords(d));
  const ordered = [...withCoords].sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));
  const polyline = ordered.map((d) => getCoords(d));
  const bounds = ordered.length > 1 ? ordered.map(getCoords) : null;
  const center = polyline[0] || [39.5, -8.0];

  return (
    <>
      <style>{`
        .tm-pin-wrapper { display: flex; flex-direction: column; align-items: center; }
        .tm-pin {
          width: 38px; height: 38px;
          background: #b85c38;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex; align-items: center; justify-content: center;
          border: 2.5px solid #fff;
          box-shadow: 0 2px 10px rgba(184,92,56,0.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: pinDrop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .tm-pin:hover { transform: rotate(-45deg) scale(1.18); box-shadow: 0 6px 18px rgba(184,92,56,0.65); }
        @keyframes pinDrop {
          from { opacity: 0; transform: rotate(-45deg) translateY(-20px) scale(0.7); }
          to   { opacity: 1; transform: rotate(-45deg) translateY(0) scale(1); }
        }
        .tm-pin-number {
          color: #fff; font-size: 13px; font-weight: 700;
          transform: rotate(45deg); line-height: 1;
        }
        .tm-pin-shadow {
          width: 12px; height: 5px;
          background: rgba(0,0,0,0.18);
          border-radius: 50%; margin-top: 2px;
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
        .leaflet-popup-content { margin: 0 !important; padding: 14px 16px !important; min-width: 190px; }
        .leaflet-popup-tip { background: #fdf8f3 !important; }
        .leaflet-popup-close-button { color: #b85c38 !important; font-size: 18px !important; top: 8px !important; right: 10px !important; }
        .tm-popup-index { font-size: 11px; font-weight: 700; color: #b85c38; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .tm-popup-title { font-size: 14px; font-weight: 700; color: #1c1814; margin-bottom: 4px; }
        .tm-popup-date { font-size: 12px; color: #8f6a52; margin-bottom: 4px; }
        .tm-popup-desc { font-size: 12px; color: #5a4a3a; margin-top: 4px; line-height: 1.4; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 12px rgba(28,24,20,0.12) !important; border-radius: 10px !important; overflow: hidden; }
        .leaflet-control-zoom a {
          background: #fdf8f3 !important; color: #b85c38 !important;
          border: none !important; font-size: 18px !important;
          width: 34px !important; height: 34px !important; line-height: 34px !important;
          transition: background 0.15s;
        }
        .leaflet-control-zoom a:hover { background: #f0e4d4 !important; }
        .travel-map-wrapper { border-radius: 14px; overflow: hidden; border: 1.5px solid #e8d5c4; box-shadow: 0 4px 24px rgba(28,24,20,0.1); position: relative; }
        .tm-badge {
          position: absolute; top: 14px; left: 14px; z-index: 1000;
          background: #fdf8f3; border: 1.5px solid #e8d5c4;
          border-radius: 10px; padding: 8px 14px;
          font-size: 13px; color: #1c1814;
          box-shadow: 0 2px 12px rgba(28,24,20,0.1);
          pointer-events: none;
        }
        .tm-badge strong { color: #b85c38; font-size: 15px; }
      `}</style>
      <div className="travel-map-wrapper" style={{ height }}>
        <div className="tm-badge">
          <strong>{ordered.length}</strong> destino{ordered.length !== 1 ? "s" : ""} na rota
        </div>
        <MapContainer
          center={center}
          zoom={3}
          className="travel-leaflet-map"
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          {bounds && <FitBounds bounds={bounds} />}
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {polyline.length > 1 && (
            <Polyline
              positions={polyline}
              pathOptions={{
                color: "#b85c38",
                weight: 3,
                opacity: 0.7,
                dashArray: "8, 10",
                lineCap: "round",
              }}
            />
          )}
          {ordered.map((d, i) => (
            <Marker
              key={d.id}
              position={getCoords(d)}
              icon={createPinIcon(i)}
              eventHandlers={{ click: () => onSelect?.(d) }}
            >
              <Popup>
                <div className="tm-popup-index">Paragem {i + 1}</div>
                <div className="tm-popup-title">
                  {getFlagEmoji(d.country)} {formatCountryName(d.country)} • {formatTitleCase(d.city)}
                </div>
                {d.visit_date && (
                  <div className="tm-popup-date">
                    {new Date(d.visit_date).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}
                  </div>
                )}
                {d.description && (
                  <div className="tm-popup-desc">
                    {d.description.length > 100 ? d.description.slice(0, 100) + "…" : d.description}
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
