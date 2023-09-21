import { Router } from "express";
import { productModel } from "../models/product.model.js";
import paginate from 'express-paginate';


const productRouter = Router();
productRouter.use(paginate.middleware(10, 50)); 

productRouter.get('/', async (req, res) => {
    const { limit, offset, page } = req.query;
   

    const itemCount = prods.length;
    const pageCount = Math.ceil(itemCount / limit);
    const prods = await productModel.paginate(query, options)


    const response = {
      status: "success",
      payload: products,
      totalPages: pageCount,
      prevPage: paginate.hasPreviousPages(req) ? page - 1 : null,
      nextPage: paginate.hasNextPages(req) ? page + 1 : null,
      page: page,
      hasPrevPage: paginate.hasPreviousPages(req),
      hasNextPage: paginate.hasNextPages(req),
      prevLink: paginate.hasPreviousPages(req) ? paginate.href(req)(true) : null,
      nextLink: paginate.hasNextPages(req) ? paginate.href(req)() : null
    };

    res.status(200).send(response);
});


productRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    const prods = await productModel.findById(parseInt(id))

    if(prods){
        res.status(200).send(prods)
    }else{
        res.status(404).send("Producto no encontrado")
    }
})

productRouter.post('/', async (req, res) => {
    const { title, description, stock, code, price, category } = req.body
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category })
        res.status(200).send({ respuesta: 'OK', mensaje: prod })

    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear el producto', mensaje: error })
    }
});

productRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const productUpdates = req.body; 
    const updatedProduct = await productModel.findByIdAndUpdate(parseInt(id), productUpdates);
    if(updatedProduct){
        res.status(200).send(updatedProduct);
    } else {
        res.status(404).send("Producto no encontrado");
    }
})

productRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(parseInt(id));
    if(deletedProduct){
        res.status(200).send("Producto eliminado");
    } else {
        res.status(404).send("Producto no encontrado");
    }
})

export default productRouter
