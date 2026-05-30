import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationForm from "./pages/DestinationForm";
import DestinationDetail from "./pages/DestinationDetail";
import MapPage from "./pages/MapPage";
import Feed from "./pages/Feed";
import FeedDetail from "./pages/FeedDetail";
import Stats from "./pages/Stats";
import PageTransition from "./components/animations/PageTransition";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">A carregar…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">A carregar…</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}


export default function App() {
  const location = useLocation();
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registo"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="destinos" element={<Destinations />} />
          <Route path="destinos/novo" element={<DestinationForm />} />
          <Route path="destinos/:id/editar" element={<DestinationForm />} />
          <Route path="destinos/:id" element={<DestinationDetail />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="feed" element={<Feed />} />
          <Route path="feed/:id" element={<FeedDetail />} />
          <Route path="estatisticas" element={<Stats />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}
