import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import PhotoGallery from "../components/PhotoGallery";
import StarRating from "../components/StarRating";
import ScrollReveal from "../components/animations/ScrollReveal";
import { getFlagEmoji, formatCountryName } from "../utils/flags";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [expForm, setExpForm] = useState({ title: "", type: "atividade", description: "", rating: 0 });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api.getDestination(id).then((res) => {
      setDest(res.data);
      setPhotos(res.data.photos || []);
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Eliminar este destino?")) return;
    await api.deleteDestination(id);
    navigate("/destinos");
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      await api.uploadPhotos(id, files);
      load();
    } catch (err) {
      setError(err.message);
    }
    e.target.value = "";
  };

  const handlePhotoDelete = async (photoId) => {
    await api.deletePhoto(photoId);
    setPhotos((p) => p.filter((x) => x.id !== photoId));
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await api.createExperience(id, {
        ...expForm,
        rating: expForm.rating || null,
      });
      setExpForm({ title: "", type: "atividade", description: "", rating: 0 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExperience = async (expId) => {
    await api.deleteExperience(expId);
    load();
  };

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
        <div className="page-header">
          <div>
            <span className={`badge ${dest.is_public ? "public" : "private"}`}>
              {dest.is_public ? "Público" : "Privado"}
            </span>
            <h1>
              {getFlagEmoji(dest.country)} {countryName} • <em>{dest.city?.trim()}</em>
            </h1>
            <p className="dest-date">{date}</p>
            {dest.rating && <StarRating value={dest.rating} readonly />}
          </div>
          <div className="header-actions">
            <Link to={`/destinos/${id}/editar`} className="btn btn-secondary">
              Editar
            </Link>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>
      </ScrollReveal>

      {error && <div className="alert alert-error">{error}</div>}

      {dest.description && (
        <ScrollReveal delay={0.1}>
          <p className="detail-desc">{dest.description}</p>
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.2}>
        <section className="section">
          <div className="section-header">
            <h2>Galeria de fotos</h2>
            <span className="hint">Máximo 4 fotos</span>
          </div>
          <PhotoGallery photos={photos} onDelete={handlePhotoDelete} editable />
          {photos.length < 4 && (
            <label className="upload-btn">
              + Adicionar fotos
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePhotoUpload}
              />
            </label>
          )}
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <section className="section">
          <h2>Experiências</h2>
          <ul className="experience-list">
            {(dest.experiences || []).map((exp) => (
              <li key={exp.id} className="experience-item">
                <div>
                  <strong>{exp.title}</strong>
                  <span className="exp-type">{exp.type}</span>
                  {exp.description && <p>{exp.description}</p>}
                  {exp.rating && <StarRating value={exp.rating} readonly />}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDeleteExperience(exp.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddExperience} className="form-card inline-form">
            <h3>Adicionar experiência</h3>
            <div className="form-row">
              <label>
                Título *
                <input
                  value={expForm.title}
                  onChange={(e) => setExpForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </label>
              <label>
                Tipo *
                <select
                  value={expForm.type}
                  onChange={(e) => setExpForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="atividade">Atividade</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="outro">Outro</option>
                </select>
              </label>
            </div>
            <label>
              Descrição
              <input
                value={expForm.description}
                onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label>
              Classificação
              <StarRating
                value={expForm.rating}
                onChange={(r) => setExpForm((f) => ({ ...f, rating: r }))}
              />
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Adicionar
            </button>
          </form>
        </section>
      </ScrollReveal>
    </div>
  );
}
