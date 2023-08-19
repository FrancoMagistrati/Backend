import productRouter from "./routers/product.js";
import cartRouter from "./routers/cart.js";
import express  from "express";
import { __dirname } from "./path.js";
import path from "path"

const app = express()
const PORT = 8080
app.get("/", (req, res) => {
    res.send("Bienvenido a la API de productos");
  });
app.use(express.json)
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productRouter)
app.use('/static', express.static(path.join(__dirname, '/public')))

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

