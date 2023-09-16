import { Router } from "express";
import { userModel } from "../models/user.model.js";

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try{
        const users = await userModel.find()
        res.status(200).send({respuesta: 'ok', mensaje: users})
    } catch(error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

userRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const user = await userModel.findById(id)
        if(user)
        res.status(200).send({respuesta: 'ok', mensaje: users})
    else
    res.status(404).send({respuesta: 'Error', mensaje: 'No encontrado'})
    } catch(error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})


userRouter.post('/', async (req, res) => {
    const {nombre, apellido, edad, email, password} = req.body
    try{
        const respuesta = await userModel.create({nombre, apellido, edad, email, password})

    } catch(error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})
