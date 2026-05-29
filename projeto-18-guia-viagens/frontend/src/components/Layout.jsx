import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/", label: "Início", icon: "🏠" },
  { to: "/destinos", label: "Destinos", icon: "📍" },
  { to: "/mapa", label: "Mapa", icon: "🗺️" },
  { to: "/feed", label: "Comunidade", icon: "🌍" },
  { to: "/estatisticas", label: "Estatísticas", icon: "📊" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">✈</span>
            <div>
              <span className="brand-title">Guia de Viagens</span>
              <span className="brand-sub">Destinos & Experiências</span>
            </div>
          </Link>
          <nav className="main-nav">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? "active" : ""}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </nav>
          <div className="user-area">
            <span className="user-name">Olá, {user?.name}</span>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Projeto 18 — IPVC ESTG · Programação Web · CTeSP TPSI</p>
      </footer>
    </div>
  );
}
