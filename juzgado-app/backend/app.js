import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import peopleRoutes from "./routes/people.routes.js";
import trialRoutes from "./routes/trial.routes.js";
import actionRoutes from "./routes/action.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/people", verifyToken, peopleRoutes);
app.use("/trial", verifyToken, trialRoutes);
app.use("/action", verifyToken, actionRoutes);
app.use("/statistics", statisticsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🚀 API del Sistema Judicial funcionando correctamente" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));