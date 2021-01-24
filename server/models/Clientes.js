const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.plugin(mongoosePaginate);

const Schema = mongoose.Schema;


const clienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El Nombre del cliente es requerido']
    },
    numDocumento: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    telefono: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Cliente', clienteSchema);