import express from "express";
import morgan from "morgan";
import cors from "cors";



import usuarioRoutes from "./routes/usuario.routes.js";
import productoRoutes from './routes/producto.routes.js'
import indexRoutes from "./routes/index.routes.js";

// const cors = require("cors");

const app = express();


// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors("cors"))
// Routes
app.use("/", indexRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", productoRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
