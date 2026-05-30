import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import PhotoGallery from "../components/PhotoGallery";
import StarRating from "../components/StarRating";
import ScrollReveal from "../components/animations/ScrollReveal";
import { getFlagEmoji, formatCountryName } from "../utils/flags";

export default function FeedDetail() {
  const { id } = useParams();
  const [dest, setDest] = useState(null);

  useEffect(() => {
    api.getFeedItem(id).then((res) => setDest(res.data));
  }, [id]);

  if (!dest) return <p className="loading">A carregar…</p>;

  const date = new Date(dest.visit_date).toLocaleDateString("pt-PT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const countryName = formatCountryName(dest.country);

  return (
    <div className="page detail-page">
      <ScrollReveal delay={0}>
        <div>
          <span className="badge public">Público</span>
          <h1>
            {getFlagEmoji(dest.country)} {countryName} • <em>{dest.city?.trim()}</em>
          </h1>
          <p className="author-line">por {dest.author_name}</p>
          <p className="dest-date">{date}</p>
          {dest.rating && <StarRating value={dest.rating} readonly />}
          {dest.description && <p className="detail-desc">{dest.description}</p>}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="section">
          <h2>Fotos</h2>
          <PhotoGallery photos={dest.photos} />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <section className="section">
          <h2>Experiências</h2>
          <ul className="experience-list">
            {(dest.experiences || []).map((exp) => (
              <li key={exp.id} className="experience-item">
                <strong>{exp.title}</strong>
                <span className="exp-type">{exp.type}</span>
                {exp.description && <p>{exp.description}</p>}
                {exp.rating && <StarRating value={exp.rating} readonly />}
              </li>
            ))}
          </ul>
          {!dest.experiences?.length && <p className="empty-msg">Sem experiências registadas.</p>}
        </section>
      </ScrollReveal>
    </div>
  );
}
