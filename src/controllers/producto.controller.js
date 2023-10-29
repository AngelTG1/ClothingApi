import { pool } from "../db.js";

export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Usuario not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, talla, tipo, color, imagen, descuentoporciento, descuento, id_usuario_fk } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO productos (nombre, categoria, precio, talla, tipo, color, imagen, descuentoporciento, descuento, id_usuario_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, categoria, precio, talla, tipo, color, imagen, descuentoporciento, descuento, id_usuario_fk]
    );
    res.status(201).json({ id: rows.insertId, nombre, categoria, precio, talla, tipo, color, imagen, descuentoporciento, descuento, id_usuario_fk });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, talla, tipo, color, imagen, descuentoporciento, descuento, id_usuario_fk } = req.body;

    const query = "UPDATE productos SET nombre = IFNULL(?, nombre), categoria = IFNULL(?, categoria), precio = IFNULL(?, precio), talla = IFNULL(?, talla), tipo = IFNULL(?, tipo), color = IFNULL(?, color), imagen = IFNULL(?, imagen), descuentoporciento = IFNULL(?, descuentoporciento), descuento = IFNULL(?, descuento) WHERE id = ?";
    const values = [nombre, categoria, precio, talla, tipo, color, imagen, descuentoporciento, descuento, id_usuario_fk, id_producto];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario not found" });

    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
