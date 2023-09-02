import express from 'express'
import multer from 'multer'
import prodsRouter from "./routes/products.routes.js";
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { promises as fs } from 'fs'; // Importa módulo "fs"

const PORT = 4000
const app = express()

//Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img') //null hace referencia a que no envia errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //Concateno el nombre original de mi archivo con milisegundos con Date.now()
    }
})

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
const upload = multer({ storage: storage })
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas

//Server Socket.io
const io = new Server(serverExpress)
const prods = []
io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado")

    socket.on('nuevoProducto', async (nuevoProd) => {
        prods.push(nuevoProd)
        socket.emit('prods', prods)

        // Aquí puedes insertar tu lógica para escribir a un archivo utilizando fs
        const productosJson = JSON.stringify(prods);
        await fs.writeFile('productos.json', productosJson); // Guarda la lista de productos en un archivo
    })

})

//Routes

app.use('/api/products', prodsRouter)

app.get('/static', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "Chat",
        js: "realTimeProducts.js"

    })
})

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})
