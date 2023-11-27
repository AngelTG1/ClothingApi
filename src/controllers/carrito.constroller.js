// Controladores de carrito (carrito.controller.js)
import { pool } from '../db.js';

export const getCarrito = async (req, res) => {
  try {
    const { id } = req.params;
   
    const [rows] = await pool.query('SELECT * FROM carrito WHERE carrito_id = ?', [id]);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};

export const getCarritoByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const [rows] = await pool.query('SELECT * FROM carrito WHERE usuario_id = ? and status=?', [idUser, 1]);
    console.log(rows.length)
    if (rows.length > 0)
      res.status(200).json({status: true, data: {idCarrito: rows[0].carrito_id}});
    else
      res.status(200).json({status: false, data: {}});
  } catch (error) {
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};

export const addToCarrito = async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad, status } = req.body;

    // Verificar si el producto ya está en el carrito
    const [existingProduct] = await pool.query(
      'SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?',
      [usuario_id, producto_id]
    );

    if (existingProduct.length > 0) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      const updatedQuantity = existingProduct[0].cantidad + cantidad;
      await pool.query(
        'UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?',
        [updatedQuantity, usuario_id, producto_id]
      );

      return res.status(200).json({ message: 'Carrito actualizado correctamente' });
    }

    // Si el producto no está en el carrito, agrégalo
    const [rows] = await pool.query(
      'INSERT INTO carrito (usuario_id, producto_id, cantidad, status) VALUES (?, ?, ?, ?)',
      [usuario_id, producto_id, cantidad, status]
    );

    res.status(201).json({ id: rows.insertId, usuario_id, producto_id, cantidad, status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};


export const removeFromCarrito = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const [rows] = await pool.query(
      'DELETE FROM carrito WHERE producto_id = ?',
      [producto_id]
    );

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: 'Producto no encontrado en ningún carrito' });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};



export const updateCarrito = async (req, res) => {
  try {
    const { usuario_id, producto_id } = req.params;
    const { cantidad } = req.body;

    const query = 'UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?';
    const values = [cantidad, usuario_id, producto_id];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

    res.json({ message: 'Carrito actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Algo salió mal' });
  }
};
