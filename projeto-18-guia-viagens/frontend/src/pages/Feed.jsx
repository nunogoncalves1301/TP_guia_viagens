import { useEffect, useState } from "react";
import { api } from "../api";
import DestinationCard from "../components/DestinationCard";
import ScrollReveal from "../components/animations/ScrollReveal";

export default function Feed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getFeed()
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <ScrollReveal delay={0}>
        <div className="page-header">
          <div>
            <h1>Comunidade</h1>
            <p>Destinos públicos partilhados por outros viajantes.</p>
          </div>
        </div>
      </ScrollReveal>

      {loading ? (
        <p className="loading">A carregar…</p>
      ) : items.length === 0 ? (
        <ScrollReveal delay={0.1}>
          <div className="empty-state">
            <p>Nenhum destino público de outros utilizadores.</p>
            <p className="hint">
              Marca os teus destinos como &quot;Público&quot; para aparecerem aqui para outros.
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <div className="card-grid">
          {items.map((d, i) => (
            <DestinationCard key={d.id} destination={d} linkPrefix="/feed" delay={i * 0.08} />
          ))}
        </div>
      )}
    </div>
  );
}
