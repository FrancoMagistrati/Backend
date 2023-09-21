import { Router } from "express";
import { cartModel } from "../models/cart.model.js";



const cartRouter = Router();


cartRouter.post('/', async (req, res) => {
    const confirmacion = await cartModel.create()
    if (confirmacion) {
        res.status(200).send("Carrito creado correctamente")
    } else {
        res.status(400).send("Error al crear carrito")
    }
})

cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            res.status(200).send({ respuesta: "Ok", mensaje: cart })
        } else {
            res.status(404).send({
                respuesta: "Error en consultar carrito",
                mensaje: "No encontrado",
            })
        }
    } catch (error) {
        res
            .status(400)
            .send({ respuesta: "error en consultar carrito", mensaje: error })
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    const cart = await cartModel.findById(cid)


    if (cart) {
        const confirmacion = await cartModel.create(cid, pid)
        if (confirmacion)
            res.status(200).send("Producto agregado correctamente")
        else
            res.status(400).send("Error al agregar producto")
    } else {
        res.status(404).send("Carrito no encontrado")
    }
})

export default cartRouter
