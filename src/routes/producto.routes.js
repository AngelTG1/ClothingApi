import { Router } from "express";
import {
  createProducto,
  deleteProducto,
  getProducto,
  getProductos,
  updateProducto,
} from "../controllers/producto.controller.js";

const router = Router();

// GET all Employees
router.get("/Productos", getProductos);

// GET An Employee
router.get("/Productos/:id", getProducto);

// DELETE An Employee
router.delete("/Productos/:id", deleteProducto);

// INSERT An Employee
router.post("/Productos", createProducto);

router.put("/Productos/:id", updateProducto);

export default router;
