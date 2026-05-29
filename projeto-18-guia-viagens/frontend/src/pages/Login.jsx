import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <h1>Guia de Viagens</h1>
          <p>Regista os teus destinos, fotos e experiências num mapa pessoal.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Entrar</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "A entrar…" : "Entrar"}
          </button>
          <p className="auth-switch">
            Não tens conta? <Link to="/registo">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
