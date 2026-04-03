const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const lessonRoutes = require("./src/routes/lessons");
const progressRoutes = require("./src/routes/progress");
const dashboardRoutes = require("./src/routes/dashboard");
const dictionaryRoutes = require("./src/routes/dictionary");
const listViewsRoutes = require("./src/routes/listViews");
const dashboardController = require("./src/controller/dashboard");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:4173",
      "http://127.0.0.1:4173",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "http://localhost:5001",
      "http://127.0.0.1:5001",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post("/ping", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true, t: Date.now() }));

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/lecciones", lessonRoutes);
app.use("/api/progreso", progressRoutes);
app.use("/api/dashboard", dashboardRoutes); // GET /:userId, GET /ranking/all
app.get("/api/ranking", dashboardController.getRanking);
app.use("/api/diccionario", dictionaryRoutes);
app.use("/api/listas", listViewsRoutes); // Endpoints de solo lectura para listar tablas y vistas

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Servidor Mouseflow listo",
    status: "Online",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  console.log(`404 handler reached for ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found", path: req.url });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
