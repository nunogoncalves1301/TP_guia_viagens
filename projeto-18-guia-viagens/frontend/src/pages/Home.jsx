import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import MapView from "../components/MapView";
import DestinationCard from "../components/DestinationCard";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([api.getDestinations(), api.getStats()])
      .then(([dest, st]) => {
        setDestinations(dest.data);
        setStats(st.data);
      })
      .catch(console.error);
  }, []);

  const recent = destinations.slice(0, 3);

  return (
    <div className="page home-page">
      <section className="hero-banner">
        <div className="hero-text">
          <span className="hero-label">O teu diário de viagens</span>
          <h1>Explora o mundo, regista cada momento</h1>
          <p>
            Adiciona destinos visitados, carrega até 4 fotos, regista restaurantes e
            atividades, e vê tudo num mapa interativo.
          </p>
          <div className="hero-actions">
            <Link to="/destinos/novo" className="btn btn-primary">
              + Novo destino
            </Link>
            <Link to="/mapa" className="btn btn-secondary">
              Ver mapa
            </Link>
          </div>
        </div>
        {stats && (
          <div className="hero-stats">
            <div className="stat-box">
              <strong>{stats.totalDestinations}</strong>
              <span>Destinos</span>
            </div>
            <div className="stat-box">
              <strong>{stats.totalCountries}</strong>
              <span>Países</span>
            </div>
            <div className="stat-box">
              <strong>{stats.totalContinents}</strong>
              <span>Continentes</span>
            </div>
          </div>
        )}
      </section>

      {destinations.length > 0 && (
        <section className="section">
          <h2>Mapa das tuas viagens</h2>
          <MapView destinations={destinations} height="360px" />
        </section>
      )}

      <section className="section">
        <div className="section-header">
          <h2>Destinos recentes</h2>
          <Link to="/destinos">Ver todos →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="empty-msg">
            Ainda não tens destinos. <Link to="/destinos/novo">Adiciona o primeiro</Link>!
          </p>
        ) : (
          <div className="card-grid">
            {recent.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
