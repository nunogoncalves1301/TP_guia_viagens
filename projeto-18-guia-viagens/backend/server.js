const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET não está definido. Verifique o ficheiro backend/.env.");
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./src/routes/auth");
const destinationRoutes = require("./src/routes/destinations");
const experienceRoutes = require("./src/routes/experiences");
const photoRoutes = require("./src/routes/photos");
const feedRoutes = require("./src/routes/feed");
const statsRoutes = require("./src/routes/stats");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadDir));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API Guia de Viagens — Projeto 18" });
});

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  if (err.code === "LIMIT_FILE_SIZE" || err.message?.includes("imagens")) {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === "ECONNREFUSED" || err.message?.includes("ECONNREFUSED")) {
    return res.status(500).json({ message: "Não foi possível conectar à base de dados. Inicie o PostgreSQL." });
  }
  res.status(500).json({ message: "Erro interno do servidor" });
});

const PORT = process.env.SERVER_PORT || 4242;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
  });
}

module.exports = app;
