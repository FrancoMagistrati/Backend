import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import prodsRouter from "./routers/product.js";
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import {userModel} from './models/user.model.js';
import cartRouter from './routers/cart.js';
import { productModel } from './models/product.model.js';
import sessionRouter from './routers/sessions.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.js' 

const PORT = 4000;
const app = express();

const whiteList = ['http://127.0.0.1:5173'] // Ajusta esta lista a tus necesidades

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    }
}

app.use(cors(corsOptions))

mongoose.connect('mongodb+srv://francomagistrati1:coderhouse@cluster0.naoex34.mongodb.net/?retryWrites=true&w=majority')
.then(async() => {
    console.log('Esta conecetado')
}) 
.catch(() => console.log('Error'))

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
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://francomagistrati1:coderhouse@cluster0.naoex34.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        },
        ttl: 60 
    }),
    secret: "usuario",
    resave: false, 
    saveUninitialized: false 
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const io = new Server(serverExpress);

io.on('connection', (socket) => {
    socket.on('addProduct', async (newProduct) => {
        await productModel.create(newProduct);
        const product = await productModel.findById();
        io.emit('product', product);
    });

    socket.on('loadProducts', async () => {
        const product = await productModel.findById();
        socket.emit('product', product);
    });
});

const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
    const product = await productModel.findById();
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

app.use('/api/cart', cartRouter)
app.use('/api/sessions', sessionRouter)

console.log(path.resolve(__dirname, './views'));

export default app;
