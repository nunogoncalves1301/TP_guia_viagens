import { useEffect, useState } from "react";
import { api } from "../api";
import DestinationCard from "../components/DestinationCard";

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
      <div className="page-header">
        <div>
          <h1>Comunidade</h1>
          <p>Destinos públicos partilhados por outros viajantes.</p>
        </div>
      </div>

      {loading ? (
        <p className="loading">A carregar…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum destino público de outros utilizadores.</p>
          <p className="hint">
            Marca os teus destinos como &quot;Público&quot; para aparecerem aqui para outros.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((d) => (
            <DestinationCard key={d.id} destination={d} linkPrefix="/feed" />
          ))}
        </div>
      )}
    </div>
  );
}
