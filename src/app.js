import express from 'express'
const app = express();
import fs from 'fs'


app.get('/productos', (req, res) => {

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    const productos = JSON.parse(data);
    const limit = req.query.limit; 

    if (limit) {
      const limitedProducts = productos.slice(0, limit); 
      res.json(limitedProducts);
    } else {
      res.json(productos); 
    }
  });
});


app.get('/productos/:pid', (req, res) => {
  const pid = req.params.pid; 


  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    const productos = JSON.parse(data);
    const producto = productos.find((p) => p.id === pid); 

    if (!producto) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.json(producto); 
    }
  });
});


app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

