import { useEffect, useState } from "react";
import { api } from "../api";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="loading">A carregar estatísticas…</p>;

  return (
    <div className="page stats-page">
      <div className="page-header">
        <div>
          <h1>Estatísticas de viagem</h1>
          <p>Resumo das tuas aventuras pelo mundo.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card large">
          <span className="stat-number">{stats.totalDestinations}</span>
          <span className="stat-label">Destinos visitados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalCountries}</span>
          <span className="stat-label">Países</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalContinents}</span>
          <span className="stat-label">Continentes</span>
        </div>
        {stats.averageRating && (
          <div className="stat-card">
            <span className="stat-number">★ {stats.averageRating}</span>
            <span className="stat-label">Classificação média</span>
          </div>
        )}
      </div>

      <div className="stats-columns">
        <section className="section">
          <h2>Países visitados</h2>
          <ul className="tag-list">
            {stats.countries.map((c) => (
              <li key={c}>
                {c} <span>({stats.byCountry[c]}×)</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Continentes</h2>
          <ul className="tag-list">
            {stats.continents.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Destinos por ano</h2>
          <ul className="bar-list">
            {Object.entries(stats.byYear)
              .sort(([a], [b]) => b - a)
              .map(([year, count]) => (
                <li key={year}>
                  <span>{year}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(count / stats.totalDestinations) * 100}%`,
                      }}
                    />
                  </div>
                  <strong>{count}</strong>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
