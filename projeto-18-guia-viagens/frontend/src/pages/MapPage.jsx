import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import MapView from "../components/MapView";
import { formatCountryName, formatTitleCase, getFlagEmoji } from "../utils/flags";

export default function MapPage() {
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [countryFilter, setCountryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDestinations().then((res) => setDestinations(res.data));
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchesCountry = countryFilter
        ? d.country.toLowerCase().includes(countryFilter.toLowerCase())
        : true;
      const visitDate = d.visit_date ? d.visit_date.split("T")[0] : "";
      const matchesFrom = dateFrom ? visitDate >= dateFrom : true;
      const matchesTo = dateTo ? visitDate <= dateTo : true;
      return matchesCountry && matchesFrom && matchesTo;
    });
  }, [destinations, countryFilter, dateFrom, dateTo]);

  const publicCount = filteredDestinations.filter((d) => d.is_public).length;
  const privateCount = filteredDestinations.length - publicCount;
  const averageRating = filteredDestinations.length
    ? (
        filteredDestinations.reduce((sum, d) => sum + (d.rating || 0), 0) /
        filteredDestinations.length
      ).toFixed(1)
    : "-";
  const latestVisit = filteredDestinations
    .filter((d) => d.visit_date)
    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))[0]?.visit_date
    ?.split("T")[0] || "-";

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
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            <span>🔍</span>
            Filtros
          </button>
          {showFilters && (
            <section className="map-filter-section">
              <div className="map-filter-row">
                <label>
                  Filtrar por país
                  <input
                    type="text"
                    placeholder="ex: Portugal"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                  />
                </label>
                <label>
                  Data desde
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </label>
                <label>
                  Data até
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </label>
              </div>
              <p className="filter-summary">
                {filteredDestinations.length} de {destinations.length} destinos na seleção
              </p>
            </section>
          )}

          {filteredDestinations.length === 0 ? (
            <p className="empty-msg">
              Nenhum destino encontrado com esses filtros.
            </p>
          ) : (
            <div className="map-layout">
              <MapView
                destinations={filteredDestinations}
                onSelect={setSelected}
                height="calc(100vh - 320px)"
              />
              <aside className="map-sidebar">
                <h3>Destinos ({filteredDestinations.length})</h3>
                <ul>
                  {filteredDestinations.map((d) => {
                    const countryName = formatCountryName(d.country);
                    return (
                      <li
                        key={d.id}
                        className={selected?.id === d.id ? "active" : ""}
                        onClick={() => {
                          setSelected(d);
                          navigate(`/destinos/${d.id}`);
                        }}
                      >
                        <div className="map-item-content">
                          <div className="map-item-title">
                            <strong>{getFlagEmoji(d.country)} {countryName}</strong>
                            <span className="map-item-separator">•</span>
                            <span className="map-item-city">{formatTitleCase(d.city)}</span>
                          </div>
                          {d.author_name && (
                            <div className="map-item-meta">
                              <span>por {d.author_name}</span>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </div>
          )}
        </>
      )}
    </div>
  );
}
