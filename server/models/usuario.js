/**
 * 
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'El rol es necesario'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} deber ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema);