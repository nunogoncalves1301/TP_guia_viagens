import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import MapView from "../components/MapView";

export default function MapPage() {
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getDestinations().then((res) => setDestinations(res.data));
  }, []);

  return (
    <div className="page map-page">
      <div className="page-header">
        <div>
          <h1>Mapa de viagens</h1>
          <p>Marcadores Leaflet para cada destino registado.</p>
        </div>
        <Link to="/destinos/novo" className="btn btn-primary">
          + Novo destino
        </Link>
      </div>

      {destinations.length === 0 ? (
        <p className="empty-msg">
          Adiciona destinos para veres marcadores no mapa.
        </p>
      ) : (
        <div className="map-layout">
          <MapView
            destinations={destinations}
            onSelect={setSelected}
            height="calc(100vh - 220px)"
          />
          <aside className="map-sidebar">
            <h3>Destinos ({destinations.length})</h3>
            <ul>
              {destinations.map((d) => (
                <li
                  key={d.id}
                  className={selected?.id === d.id ? "active" : ""}
                  onClick={() => setSelected(d)}
                >
                  <strong>{d.city}</strong>, {d.country}
                  <Link to={`/destinos/${d.id}`}>Ver →</Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
