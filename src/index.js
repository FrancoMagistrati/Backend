import express from 'express';
import multer from 'multer';
import prodsRouter from "./routers/product.js";
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { promises as fs } from 'fs';

const PORT = 4000;
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    }
});

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(serverExpress);
const prods = [];

io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado");

    socket.on('nuevoProducto', async (nuevoProd) => {
        prods.push(nuevoProd);
        io.emit('prods', prods);

        const productosJson = JSON.stringify(prods);
        await fs.writeFile('productos.json', productosJson);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

const upload = multer({ storage: storage });
app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('home.handlebars', { title: 'Mi Aplicación' });
});

app.use('/api/product', prodsRouter);

app.get('/static', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "Chat",
        js: "realTimeProducts.js"
    });
});

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.status(200).send("Imagen cargada");
});

console.log(path.resolve(__dirname, './views'));

export default app;
