const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

mongoose.plugin(paginate);

const Schema = mongoose.Schema;


const categoriasSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
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

})


module.exports = mongoose.model('Categoria', categoriasSchema);