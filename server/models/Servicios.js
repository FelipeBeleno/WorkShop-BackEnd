const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const moment = require('moment')
const tz = require('moment-timezone')
const Schema = mongoose.Schema;

const fecha = moment(new Date()).tz('America/Bogota').utc(true)


const serviciosSchema = new Schema({
    tipoServicio: {
        type: String,
        required: true,
        enum: { values: ['ARREGLO', 'VENTA'], message: `{VALUE} Campo no permitido` }
    },
    numConsulta: {
        type: Number
    },
    numServicio: {
        type: Number,
        default: 0
    },
    procesoServicio: {
        type: String,
        enum: { values: ['RECIBIDO', 'EN PROCESO', 'FINALIZADO', 'VENTA'], message: `{VALUE} Campo no permitido` }
    },
    precioTotal: {
        type: Number,
        //required: true,
    },
    fechaRegistro_iso: {
        type: Date,
        required: true,
        default: fecha.format()


    },
    estado: {
        type: Boolean,
        default: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    procedimientos: [{
        procedimientos: {
            type: Schema.Types.ObjectId,
            ref: 'Procediemiento'
        },
        nombre: {
            type: String,
        },
        descripcion: {
            type: String
        },
        precio: {
            type: Number
        }
    }],
    observaciones: [{
        obj: {
            type: String
        }
    }
    ],
    objetos: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Objeto'
            },
            cantidad: {
                type: Number,
                required: true
            },
            precioUnidad: {
                type: Number
            },
            totalCompraItem: {
                type: Number
            },
            nombreObjeto: {
                type: String
            }
        }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

serviciosSchema.plugin(validator)



module.exports = mongoose.model('Servicio', serviciosSchema);