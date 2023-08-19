import { Router } from "express";
import productManager from "./productManager.js";
const productRouter = Router();

productRouter.get('/', async (req, res) => {
    const {limit} = req.query
    const prods = await productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)
})

productRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    const prods = await productManager.getProductsById(parseInt(id))

    if(prods){
        res.status(200).send(prods)
    }else{
        res.status(404).send("Producto no encontrado")
    }


})

export default productRouter