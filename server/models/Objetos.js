const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const objetosSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    cantidadDisponible: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    },
    precio: {
        type: Number,
        required: true
    },
    alerta: {
        type: String,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'

    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'

    }
});

module.exports = mongoose.model('Objeto', objetosSchema);