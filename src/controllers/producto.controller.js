import { pool } from "../db.js";

export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductsUser = async (req, res) => {
  try {
    const {id} = req.params
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
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
    const [rows] = await pool.query("DELETE FROM products WHERE id = ?", [id]);

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
    const { title, price, description, category, color, size, type, image, amount, id_usuario_fk } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO products (title, price, description, category, color, size, type, image, amount, id_usuario_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, price, description, category, color, size, type, image, amount, id_usuario_fk]
    );
    res.status(201).json({ id: rows.insertId, title, price, description, category, color, size, type, image, amount, id_usuario_fk });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      price,
      description,
      category,
      color,
      size,
      type,
      image,
      amount,
      id_usuario_fk,
    } = req.body;

    const query =
      "UPDATE products SET title = IFNULL(?, title), price = IFNULL(?, price), description = IFNULL(?, description), category = IFNULL(?, category), color = IFNULL(?, color), size = IFNULL(?, size), type = IFNULL(?, type), image = IFNULL(?, image), amount = IFNULL(?, amount), id_usuario_fk = IFNULL(?, id_usuario_fk) WHERE id = ?";
    const values = [
      title,
      price,
      description,
      category,
      color,
      size,
      type,
      image,
      amount,
      id_usuario_fk,
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario not found" });

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

