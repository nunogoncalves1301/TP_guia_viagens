import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function DestinationCard({ destination, linkPrefix = "/destinos" }) {
  const date = new Date(destination.visit_date).toLocaleDateString("pt-PT", {
    year: "numeric",
    month: "long",
  });

  return (
    <article className="dest-card">
      <div className="dest-card-header">
        <h3>
          {destination.city}, <em>{destination.country}</em>
        </h3>
        <span className={`badge ${destination.is_public ? "public" : "private"}`}>
          {destination.is_public ? "Público" : "Privado"}
        </span>
      </div>
      <p className="dest-date">{date}</p>
      {destination.rating && <StarRating value={destination.rating} readonly />}
      {destination.description && (
        <p className="dest-desc">
          {destination.description.length > 120
            ? `${destination.description.slice(0, 120)}…`
            : destination.description}
        </p>
      )}
      <div className="dest-meta">
        {destination.photo_count !== undefined && (
          <span>📷 {destination.photo_count}</span>
        )}
        {destination.experience_count !== undefined && (
          <span>✨ {destination.experience_count}</span>
        )}
        {destination.author_name && <span>por {destination.author_name}</span>}
      </div>
      <Link to={`${linkPrefix}/${destination.id}`} className="btn btn-sm">
        Ver detalhes →
      </Link>
    </article>
  );
}
