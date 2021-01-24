const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.plugin(mongoosePaginate)

const Schema = mongoose.Schema;

const valorDefecto = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: `{VALUE} Error`
}

const usuariosSchema = new Schema({
    nombreApellido: {
        type: String,
        required: [true, 'El nombre y apellido es requerido']
    },
    documento: {
        type: String,
        required: false,
        unique: true
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: valorDefecto
    },
    estado: {
        type: Boolean,
        default: true,

    }
});

usuariosSchema.plugin(validator, { message: '{PATH} debe ser unico el campo' })

usuariosSchema.methods.toJSON = function () {
    // user ahora tiene el valor que hay actualmente en el objeto
    let user = this;
    //recuperar el objeto que tiene el usuario en ese momento
    let objUser = user.toObject();

    delete objUser.contraseña;

    return objUser;

}


module.exports = mongoose.model('Usuario', usuariosSchema);