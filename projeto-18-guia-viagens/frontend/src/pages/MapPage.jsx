import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import MapView from "../components/MapView";
import AnimatedMap from "../components/animations/AnimatedMap";
import ScrollReveal from "../components/animations/ScrollReveal";

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
        <>
          <ScrollReveal delay={0.1}>
            <section className="section">
              <h2>Rota animada dos teus destinos</h2>
              <p style={{ marginBottom: '16px', color: '#666' }}>
                Visualiza a sequência dos teus últimos destinos visitados com uma animação interativa.
              </p>
              <AnimatedMap
                destinations={destinations.slice(0, 5).map((d, i) => ({
                  id: d.id,
                  label: d.city,
                  x: 80 + i * 130,
                  y: 130 + (i % 2) * 40,
                }))}
                paths={destinations.slice(0, 4).map((_, i) => {
                  const x1 = 80 + i * 130;
                  const y1 = 130 + (i % 2) * 40;
                  const x2 = 80 + (i + 1) * 130;
                  const y2 = 130 + ((i + 1) % 2) * 40;
                  return `M ${x1},${y1} C ${(x1 + x2) / 2},${y1 - 20} ${(x1 + x2) / 2},${y2 + 20} ${x2},${y2}`;
                })}
              />
            </section>
          </ScrollReveal>
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
        </>
      )}
    </div>
  );
}
