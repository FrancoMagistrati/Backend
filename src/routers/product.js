// product.router.js
import { Router } from "express";
import { productModel } from "../models/product.model.js";
import paginate from 'express-paginate';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';

const productRouter = Router();
productRouter.use(paginate.middleware(10, 50)); 

productRouter.get('/', async (req, res) => {
   let {limit, sort, page, category} = req.query;
   limit = limit ?? 5
   page = page ?? 1

   try{
       const products = await productModel.paginate(category ? {category: category} : {}, {limit: limit, page: page, sort: {price: sort}});
       res.status(200).send(products)
   }catch (error){
       res.status(400).send({message: "Error en buscar productos"})
   }
});

productRouter.get('/:id', async (req, res) => {
   const {id} = req.params
   const prods = await productModel.findById(pid)

   if(prods){
       res.status(200).send(prods)
   }else{
       res.status(404).send("Producto no encontrado")
   }
})

productRouter.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
   const { title, description, stock, code, price, category } = req.body
   try {
       const prod = await productModel.create({ title, description, stock, code, price, category })
       res.status(200).send({ respuesta: 'OK', mensaje: prod })

   } catch (error) {
       res.status(400).send({ respuesta: 'Error en crear el producto', mensaje: error })
   }
});

productRouter.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
   const {id} = req.params;
   const productUpdates = req.body; 
   const updatedProduct = await productModel.findByIdAndUpdate(id, productUpdates);
   if(updatedProduct){
       res.status(200).send(updatedProduct);
   } else {
       res.status(404).send("Producto no encontrado");
   }
})

productRouter.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
   const {id} = req.params;
   const deletedProduct = await productModel.findByIdAndDelete(id);
   if(deletedProduct){
       res.status(200).send("Producto eliminado");
   } else {
       res.status(404).send("Producto no encontrado");
   }
})

export default productRouter
