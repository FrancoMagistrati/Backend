import express from 'express';
import multer from 'multer';
import prodsRouter from "./routers/product.js";
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { promises as fs } from 'fs';
import ProductManager from './routers/productManager.js';

const PORT = 4000;
const app = express();

const manager = new ProductManager(path.join(__dirname, '/productos.json'))

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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '/public')));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));




const io = new Server(serverExpress);
const prods = [];

io.on('connection', (socket) => {

    socket.on('addProduct', async (newProduct) => {
        await manager.addProduct(newProduct);
        const product = await manager.getProducts();
        io.emit('product', product);
    });

    socket.on('loadProducts', async () => {
        
        const product = await manager.getProducts();
        socket.emit('product', product);
    });

});


const upload = multer({ storage: storage });


app.get('/', async (req, res) => {
const product = await manager.getProducts();
res.render('home', {
    title: 'Products',
    product: product
});
});

app.use('/api/product', prodsRouter);

app.get('/realTime', (req, res) => {
    res.render('realTimeProducts', {
        title: "Real Time Products",
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
