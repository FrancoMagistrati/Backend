import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";



const cartRouter = Router();


cartRouter.post('/', async (req, res) => {
    const confirmacion = await cartModel.create({})
    if (confirmacion) {
        res.status(200).send({message: "Carrito creado correctamente", cart: confirmacion})
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
    const { cid, pid } = req.params;
    const { quantity } = req.body;

   

try{
    const cart = await cartModel.findById(cid)
    if (cart) {
        const prod = await productModel.findById(pid)
        
        if(prod){
            const indice = cart.products.findIndex(
                (item) => item.id_prod === pid
            );
            if(indice !=1){
                cart.products[indice].quantity = quantity;
            }else {
                cart.products.push({id_prod: pid, quantity: quantity})
            }

            const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
            res.status(200).send({respuesta: "ok", mensaje:respuesta})
        }else {
            res.status(404).send({
                mensaje:"producto no encontrado"
            });
        }

}else{
    res.status(404).send({
        mensaje:"Carrito no encontrado"
    });
}

    }catch (error){
        console.log(error)
        res.status(400).send({
            mensaje:error,
        })
    }
})

export default cartRouter
