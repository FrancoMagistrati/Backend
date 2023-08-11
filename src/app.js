import express from 'express'
const app = express();
import fs from 'fs'


// Endpoint para obtener todos los productos
app.get('/productos', (req, res) => {
  // Leer el archivo 'productos.json'
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    const productos = JSON.parse(data);
    const limit = req.query.limit; // Obtener el valor del parámetro de consulta 'limit'

    if (limit) {
      const limitedProducts = productos.slice(0, limit); // Obtener solo el número de productos solicitados
      res.json(limitedProducts);
    } else {
      res.json(productos); // Devolver todos los productos si no se recibe el parámetro 'limit'
    }
  });
});

// Endpoint para obtener un producto por su ID
app.get('/productos/:pid', (req, res) => {
  const pid = req.params.pid; // Obtener el valor del parámetro de ruta 'pid'

  // Leer el archivo 'productos.json'
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    const productos = JSON.parse(data);
    const producto = productos.find((p) => p.id === pid); // Buscar el producto con el ID proporcionado

    if (!producto) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.json(producto); // Devolver el producto encontrado
    }
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

