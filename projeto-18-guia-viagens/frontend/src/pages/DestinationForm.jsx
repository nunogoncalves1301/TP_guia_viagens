import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { api } from "../api";
import StarRating from "../components/StarRating";
import "react-datepicker/dist/react-datepicker.css";

function toLocalDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    country: "",
    city: "",
    visit_date: "",
    description: "",
    rating: 0,
    is_public: false,
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedDate = form.visit_date ? new Date(form.visit_date) : null;

  useEffect(() => {
    if (!isEdit) return;
    api
      .getDestination(id)
      .then((res) => {
        const d = res.data;
        setForm({
          country: d.country,
          city: d.city,
          visit_date: d.visit_date?.split("T")[0] || d.visit_date,
          description: d.description || "",
          rating: d.rating || 0,
          is_public: d.is_public,
          latitude: d.latitude || "",
          longitude: d.longitude || "",
        });
      })
      .catch(() => navigate("/destinos"));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const body = {
      ...form,
      rating: form.rating || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    };
    try {
      if (isEdit) {
        await api.updateDestination(id, body);
        navigate(`/destinos/${id}`);
      } else {
        const res = await api.createDestination(body);
        navigate(`/destinos/${res.data.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page form-page">
      <h1>{isEdit ? "Editar destino" : "Novo destino"}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <label>
            País *
            <input name="country" value={form.country} onChange={handleChange} required />
          </label>
          <label>
            Cidade *
            <input name="city" value={form.city} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Data de visita *
          <DatePicker
            selected={selectedDate}
            onChange={(date) =>
              setForm((f) => ({
                ...f,
                visit_date: date ? toLocalDateInput(date) : "",
              }))
            }
            dateFormat="yyyy-MM-dd"
            placeholderText="Seleciona a data da viagem"
            showPopperArrow={false}
            calendarClassName="trip-date-calendar"
            className="trip-date-input"
            required
          />
        </label>
        <label>
          Descrição
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Conta a tua experiência neste destino…"
          />
        </label>
        <label>
          Classificação
          <StarRating value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
        </label>
        <div className="form-row">
          <label>
            Latitude (opcional)
            <input
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              placeholder="ex: 38.7223"
            />
          </label>
          <label>
            Longitude (opcional)
            <input
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              placeholder="ex: -9.1393"
            />
          </label>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_public"
            checked={form.is_public}
            onChange={handleChange}
          />
          Destino público (visível no feed da comunidade)
        </label>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "A guardar…" : isEdit ? "Guardar" : "Criar destino"}
          </button>
        </div>
      </form>
    </div>
  );
}
