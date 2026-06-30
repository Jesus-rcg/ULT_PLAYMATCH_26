import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerDocumentation from "./swagger.json" with { type: "json" };

import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import torneoRoutes from "./routes/torneoRoutes.js";
import inscripcionEquiposRoutes from "./routes/inscripcionEquiposRoutes.js";
import inscripcionJugadoresRoutes from "./routes/inscripcionJugadoresRoutes.js";
import equiposRoutes from "./routes/equiposRoutes.js";
import jugadoresRoutes from "./routes/jugadoresRoutes.js";
import encuentrosRoutes from "./routes/encuentrosRoutes.js";
import posicionesRoutes from "./routes/posicionesRoutes.js";
import cronologiasRoutes from "./routes/cronologiasRoutes.js";
import resultadosRoutes from "./routes/resultadosRoutes.js";
import alineacionRoutes from "./routes/alineacionRoutes.js";

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📢 Petición entrante: ${req.method} a la ruta: ${req.originalUrl}`);
  next();
});

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// SWAGGER
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/torneos", torneoRoutes);
app.use("/api/inscripcionEquipos", inscripcionEquiposRoutes);
app.use("/api/inscripcionJugadores", inscripcionJugadoresRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/jugadores", jugadoresRoutes);
app.use("/api/encuentros", encuentrosRoutes);
app.use("/api/posiciones", posicionesRoutes);
app.use("/api/cronologias", cronologiasRoutes);
app.use("/api/resultados", resultadosRoutes);
app.use("/api/alineaciones", alineacionRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});

export default app;
