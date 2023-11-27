import { Router } from "express";
import {
    getCarrito,
    getCarritoByUser,
    addToCarrito,
    removeFromCarrito,
    updateCarrito,
} from "../controllers/carrito.constroller.js";

const router = Router();

// GET all Employees
router.get("/carrito/:id", getCarrito);
router.get("/carrito/:idUser/user",getCarritoByUser ); //Retornar el id del carrito activo para ese usuario

// GET An Employee
// router.get("/usuarios/:id", getUsuario);

// DELETE An Employee
router.delete("/carrito/producto/:producto_id", removeFromCarrito);

// INSERT An Employee
router.post("/carrito/", addToCarrito);

router.put("/carrito/:id", updateCarrito);


export default router;
