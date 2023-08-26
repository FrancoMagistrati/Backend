import express from 'express'
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import { __dirname } from './path.js';
import path from 'path'

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');


app.set('views', path.join(__dirname, 'vista'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }));


function obtenerProductos() {

  const jsonString = fs.readFileSync('../../productos.json', 'utf-8');


  const productos = JSON.parse(jsonString);


  return productos;
}


function crearProducto(nombre) {

  const producto = nombre;


  io.emit('nuevoProducto', producto);
}


function eliminarProducto(id) {

  const productoId = id;


  io.emit('eliminarProducto', productoId);
}


io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');


  socket.on('nuevoProducto', (producto) => {

    io.emit('productoCreado', producto);
  });

  socket.on('eliminarProducto', (productoId) => {

    io.emit('productoEliminado', productoId);
  });
});


app.get('/realtimeproducts', (req, res) => {

  res.render('realTimeProducts', { productos: obtenerProductos() });
});


app.post('/crearproducto', (req, res) => {
  const nombreProducto = req.body.nombre;

  io.emit('nuevoProducto', nombreProducto);

  res.redirect('/realtimeproducts');
});


app.post('/eliminarproducto', (req, res) => {
  const productoId = req.body.id;

 
  io.emit('eliminarProducto', productoId);

  res.redirect('/realtimeproducts');
});


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
