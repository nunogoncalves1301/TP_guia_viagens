import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import DestinationCard from "../components/DestinationCard";
import ScrollReveal from "../components/animations/ScrollReveal";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDestinations()
      .then((res) => setDestinations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <ScrollReveal delay={0}>
        <div className="page-header">
          <div>
            <h1>Os meus destinos</h1>
            <p>Gere os teus destinos visitados — públicos ou privados.</p>
          </div>
          <Link to="/destinos/novo" className="btn btn-primary">
            + Novo destino
          </Link>
        </div>
      </ScrollReveal>

      {loading ? (
        <p className="loading">A carregar…</p>
      ) : destinations.length === 0 ? (
        <ScrollReveal delay={0.1}>
          <div className="empty-state">
            <p>Nenhum destino registado.</p>
            <Link to="/destinos/novo" className="btn btn-primary">
              Adicionar primeiro destino
            </Link>
          </div>
        </ScrollReveal>
      ) : (
        <div className="card-grid">
          {destinations.map((d, i) => (
            <DestinationCard key={d.id} destination={d} delay={i * 0.08} />
          ))}
        </div>
      )}
    </div>
  );
}
