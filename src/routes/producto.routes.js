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
router.get("/products", getProductos);

// GET An Employee
router.get("/products/:id", getProducto);

// DELETE An Employee
router.delete("/products/:id", deleteProducto);

// INSERT An Employee
router.post("/products", createProducto);

router.put("/products/:id", updateProducto);

export default router;
