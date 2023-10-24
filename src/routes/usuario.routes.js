import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getUsuario,
  getUsuarios,
  updateUsuario,
} from "../controllers/usuario.controller.js";

const router = Router();

// GET all Employees
router.get("/usuarios", getUsuarios);

// GET An Employee
router.get("/usuarios/:id", getUsuario);

// DELETE An Employee
router.delete("/usuarios/:id", deleteUsuario);

// INSERT An Employee
router.post("/usuarios", createUsuario);

router.put("/usuarios/:id", updateUsuario);

export default router;
