import { pool } from "../db.js";

export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
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

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasenia } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, correo, contrasenia) VALUES (?, ?, ?, ?)",
      [nombre, apellido, correo, contrasenia]
    );
    res.status(201).json({ id: rows.insertId, nombre, apellido, correo, contrasenia });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, contrasenia } = req.body;

    const query = "UPDATE usuarios SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), correo = IFNULL(?, correo), contrasenia = IFNULL(?, contrasenia) WHERE id = ?";
    const values = [nombre, apellido, correo, contrasenia, id];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario not found" });

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
