import {Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2"

const userSchema = new Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    email: {
        type: String,
        unique: true,
    },
    password: String,
})

userSchema.plugin(paginate)

export const userModel = model('users', userSchema)