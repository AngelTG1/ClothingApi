  import { pool } from "../db.js";
  import jwt from 'jsonwebtoken';
  import bcrypt from 'bcrypt';

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
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

      if (rows.length <= 0) {
        return res.status(404).json({ message: "Usuario not found" });
      }

      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  export const loginUsuario = async (req, res) => {
    try {
      const { correo, contrasenia } = req.body;
  
      // Buscar al usuario por su correo
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
  
      if (rows.length === 0) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
  
      const user = rows[0];
  
      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
  
      // Crear un token JWT para la autenticación
      const token = jwt.sign({ usuario_id: user.id, correo: user.correo }, 'mi_secreto', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Algo salió mal" });
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

  // export const createUsuario = async (req, res) => {
  //   try {
  //     const { nombre, apellido, correo, contrasenia, rol } = req.body;
  //     const [rows] = await pool.query(
  //       "INSERT INTO usuarios (nombre, apellido, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?)",
  //       [nombre, apellido, correo, contrasenia, rol]
  //     );
  //     res.status(201).json({ id: rows.insertId, nombre, apellido, correo, contrasenia, rol });
  //   } catch (error) {
  //     return res.status(500).json({ message: "Something goes wrong" });
  //   }
  // };

  export const createUsuario = async (req, res) => {
    try {
      const { nombre, apellido, correo, contrasenia, rol } = req.body;
      const [userResult] = await pool.query(
        "INSERT INTO usuarios (nombre, apellido, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?)",
        [nombre, apellido, correo, contrasenia, rol]
      );
  
      const usuario_id = userResult.insertId;
  
      // Crea un carrito vacío vinculado al nuevo usuario
      await pool.query("INSERT INTO carritos (usuario_id) VALUES (?)", [usuario_id]);
  
      res.status(201).json({ id: usuario_id, nombre, apellido, correo, contrasenia, rol });
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  export const updateUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, correo, contrasenia, rol } = req.body;

      const query = "UPDATE usuarios SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), correo = IFNULL(?, correo), contrasenia = IFNULL(?, contrasenia), rol = IFNULL(?, rol) WHERE id = ?";
      const values = [nombre, apellido, correo, contrasenia, rol, id];

      const [result] = await pool.query(query, values);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Usuario not found" });

      const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };
