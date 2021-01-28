const express = require('express');
const { validacionToken, validacionAdmin } = require('../middleware/validaciones');
const Servicio = require('../models/Servicios');
const Objeto = require('../models/Objetos');
const moment = require('moment');
const { utc } = require('moment');
require('moment/locale/es-mx')

moment.locale('es-mx')
const app = express();





//consulta por dia
app.get('/servicios/total/:dia', (req, res) => {
    const dia = req.params.dia;
    let diaF = moment(dia, 'YYYY-MM-DD').utc(true)
    Servicio.find({ fechaRegistro_iso: { $gt: diaF.format(), $lt: diaF.endOf('day').format() } }, (err, servicios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            servicios
        })
    })
})

// consulta tres meses antes
app.get('/servicios/tercerMes', validacionToken, (req, res) => {
    Servicio.find({ fechaRegistro_iso: { $gte: moment(new Date(), 'YYYY-MMMM-DD').subtract(3, 'months').date(1).format('YYYY-MMMM-DD'), $lte: moment(new Date(), 'YYYY-MMMM-DD').subtract(3, 'months').endOf('month').format('YYYY-MM-DD') }, tipoServicio: 'VENTA' },
        (err, tercerMes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            Servicio.find({ fechaRegistro_iso: { $gte: moment(new Date(), 'YYYY-MM-DD').subtract(2, 'months').date(1).format('YYYY-MM-DD'), $lte: moment(new Date(), 'YYYY-MM-DD').subtract(2, 'months').endOf('month').format('YYYY-MM-DD') }, tipoServicio: 'VENTA' },
                (err, segundoMes) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: err
                        })
                    }

                    Servicio.find({ fechaRegistro_iso: { $gte: moment(new Date(), 'YYYY-MM-DD').subtract(1, 'months').date(1).format('YYYY-MM-DD'), $lte: moment(new Date(), 'YYYY-MM-DD').subtract(1, 'months').endOf('month').format('YYYY-MM-DD') }, tipoServicio: 'VENTA' },
                        (err, mesAtras) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    error: err
                                })
                            }
                            Servicio.find({ fechaRegistro_iso: { $gte: moment(new Date()).date(1).format('YYYY-MM-DD') }, tipoServicio: 'VENTA' },
                                (err, mesActual) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            error: err
                                        })
                                    }
                                    res.json({
                                        ok: true,
                                        tercerMes,
                                        segundoMes,
                                        mesAtras,
                                        mesActual
                                    })
                                })
                        })
                })
        })
})

app.get('/servicios/segundoMes', (req, res) => {

})

// consulta de ventas y dinero por fecha por mes
app.get('/servicios/dec', validacionToken, (req, res) => {

    Servicio.find({ fechaRegistro_iso: { $gte: moment(new Date()).date(1).format('YYYY-MM-DD') }, tipoServicio: 'VENTA' }, (err, dato) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }

        const resultadoVentas = dato.reduce((contador, ele) => {
            contador += ele.precioTotal

            return contador
        }, 0)


        Servicio.countDocuments({ fechaRegistro_iso: { $gte: moment(new Date()).date(1).format('YYYY-MM-DD') }, tipoServicio: 'VENTA' }, (err, contador) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }

            res.json({
                ok: true,
                totalVendidoMes: resultadoVentas,
                numeroVentasMes: contador,
                dato
            })

        })
    })

})

app.get('/servicios/arr', validacionToken, (req, res) => {

    Servicio.countDocuments({ /* fechaRegistro_iso: { $gte: moment(new Date()).date(1).format('YYYY-MM-DD') } ,*/ tipoServicio: 'ARREGLO', estado: true }, (err, contador) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            arreglospendientes: contador

        })
    })
})


// Consultar trabajos (ARREGLOS)
app.get('/servicio/arreglo/activo', validacionToken, (req, res) => {

    Servicio.find({ estado: true, tipoServicio: 'ARREGLO' }, (err, servicios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            servicios
        })
    }).populate('usuario cliente objetos procedimientos', 'nombreApellido numDocumento nombre telefono email descripcion')
});

// consulta de servicios incativos
app.get('/servicio/arreglo/inactivo', validacionToken, (req, res) => {

    Servicio.find({ estado: false, tipoServicio: 'ARREGLO' }, (err, servicios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            servicios
        })
    }).populate('usuario cliente objetos procedimientos', 'nombreApellido numDocumento nombre telefono email descripcion')
});


// consulta de ventas TODAS
/* app.get('/servicio/venta/activo', validacionToken, (req, res) => {

    const page = parseFloat(req.query.page) || 1;

    const limit = parseFloat(req.query.limit) || 5;

    const opciones = {
        limit,
        page,
        populate: {
            path: 'usuario cliente objetos',
            select: 'nombreApellido nombre email telefono'
        }
    }

    Servicio.paginate({ tipoServicio: 'VENTA' }, opciones, (err, servicios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            servicios
        })
    })
});
 */

// consultar venta por id
app.get('/servicios/clientes/ventas/:id', (req, res) => {
    const id = Number(req.params.id);



    Servicio.find({ numConsulta: id }, (err, venta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (venta === undefined || venta === null) {
            return res.status(400).json({
                ok: false,
                error: err,
                mensaje: 'Id invalido'
            })
        }
        res.json({
            ok: true,
            venta
        })
    }).populate('cliente usuario', 'nombre nombreApellido numDocumento email telefono')
})

//consulta de ventas todas !
app.get('/servicios/ventas/consultas', validacionToken, (req, res) => {

    Servicio.find({ tipoServicio: 'VENTA' }, (err, ventas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            ventas
        })
    }).populate('cliente usuario', 'nombre nombreApellido')
})

// consultar servicios TODOS (ARREGLOS)
app.get('/usuario/arreglo/inactivo', validacionToken, (req, res) => {

    const page = parseFloat(req.query.page) || 1;

    const limit = parseFloat(req.query.limit) || 5;

    const opciones = {
        limit,
        page,
        populate: [{
            path: 'usuario',
            select: 'nombreApellido',
            model: 'usuario'
        }, {
            path: 'cliente',
            select: 'nombre email',
            model: 'Cliente'
        }]
    }

    Servicio.paginate({ estado: false, tipoServicio: 'ARREGLOS' }, opciones, (err, servicios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            servicios
        })
    })
});

// consulta por cedula
/* 
app.get('/servicio/clientes/', (req, res) => {


    Servicio.findOne()
        .populate('usuario cliente')
        .exec((err, resp) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            res.json({ ok: true, resp })

        })

}) */

// consulta de arreglos (ESTADO ACTIVO)
app.get('/servicio/:numConsulta', (req, res) => {

    const numConsulta = req.params.numConsulta;

    Servicio.findOne({ numConsulta: numConsulta, estado: true || false }, (err, servicio) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!servicio) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El servicio no existe'
                }
            })
        }
        if (servicio.estado === true) {
            return res.json({
                ok: true,
                servicio: servicio
            })
        } else {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'El estado de su arreglo es inactivo'
                }
            })
        }

    }).populate('cliente')
});

// creacion de servicio
app.post('/servicio', [validacionToken, validacionAdmin], async (req, res) => {

    const body = req.body;

    const objetosArray = body.objetos

    const observacionesData = body.observaciones

    const servicio = new Servicio({
        tipoServicio: body.tipoServicio,
        cliente: body.cliente,
        usuario: req.usuario
    })

    if (servicio.tipoServicio === 'VENTA') {
        servicio.save((err, servicio) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }

            // Aqui ya esta guardado el servicio
            // se busca el id con el que quedo guardado y se le asignan las variables a los demas datos
            Servicio.findById(servicio._id, (err, dataEdit) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        error: err
                    })
                }
                Servicio.countDocuments((err, count) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            error: err
                        })
                    }

                    dataEdit.precioTotal = body.precioTotal
                    dataEdit.procesoServicio = 'VENTA'
                    dataEdit.cliente = body.cliente
                    dataEdit.objetos = objetosArray
                    dataEdit.observaciones = observacionesData
                    dataEdit.estado = false
                    dataEdit.numServicio = count + 1 + 1000
                    dataEdit.numConsulta = body.numConsulta + dataEdit.numServicio
                    dataEdit.save()

                    res.json({
                        ok: true,
                        servicio: dataEdit
                    })

                    // restar valores en la base de datos
                    dataEdit.objetos.forEach((elemento) => {
                        Objeto.findById(elemento.producto, (err, cambioStock) => {
                            if (err) {
                                res.status(400).json({
                                    ok: false,
                                    error: err
                                })
                            }
                            cambioStock.cantidadDisponible -= elemento.cantidad
                            cambioStock.save()

                        })
                    });


                })

            })
        })

    }
    // area de trabajo para el arreglo
    else if (servicio.tipoServicio === 'ARREGLO') {

        servicio.save((err, arreglo) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            Servicio.findById(arreglo._id, (err, guardarArreglo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    })
                }

                Servicio.countDocuments((err, count) => {

                    guardarArreglo.precioTotal = body.precioTotal
                    guardarArreglo.procesoServicio = body.procesoServicio
                    guardarArreglo.cliente = body.cliente
                    guardarArreglo.observaciones = observacionesData
                    guardarArreglo.numServicio = count + 1 + 1000
                    guardarArreglo.objetos = objetosArray
                    guardarArreglo.estado = true
                    guardarArreglo.procedimientos = body.procedimientos
                    guardarArreglo.numConsulta = body.numConsulta + guardarArreglo.numServicio


                    /*    guardarArreglo.objetos.forEach((elemento) => {
                           Objeto.findById(elemento.producto, (err, cambioStock) => {
                               if (err) {
                                   res.status(400).json({
                                       ok: false,
                                       error: err
                                   })
                               }
                               cambioStock.cantidadDisponible -= elemento.cantidad
                               cambioStock.save()
   
                           })
                       });
    */
                    //dataEdit.objetos = objetosArray
                    guardarArreglo.save((err, data) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                error: err
                            })
                        }
                        res.json({
                            ok: true,
                            servicio: data
                        })
                    })
                })

            })
        })

    }
    // no es ni arreglo ni venta
    else {

        return res.send('ERRRRRRRRRROOORR')
    }
})

// edicion de servicio
app.put('/servicio/arreglo/:id', validacionToken, (req, res) => {

    const id = req.params.id;

    const body = req.body;


    Servicio.findByIdAndUpdate(id, body, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (data === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    err,
                    mensaje: 'ID de servicio invalido'
                }
            })
        }

        if (body.objetos.length > 0) {

            data.objetos = body.objetos
        }

        if (body.observaciones.length !== 0) {

            data.observaciones = body.observaciones
        }

        if (body.procedimientos.length !== 0) {

            data.procedimientos = body.procedimientos
        }

        data.procesoServicio = body.procesoServicio
        data.estado = body.procesoServicio === 'FINALIZADO' ? false : true
        data.precioTotal = body.precioTotal

        data.objetos.forEach((elemento) => {
            Objeto.findById(elemento.producto, (err, cambioStock) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        error: err
                    })
                }
                cambioStock.cantidadDisponible -= elemento.cantidad
                cambioStock.save()
            })
        });

        data.save()
        res.json({
            ok: true,
            data
        })
    }).populate('cliente', 'nombre telefono numDocumento')

});

//ELIMINAR SERVICIOS
app.delete('/servicio/borrar/:id', validacionToken, (req, res) => {

    const id = req.params.id;

    Servicio.findByIdAndDelete(id, (err, resp) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (resp === null) {
            return res.status(400).json({
                ok: false,
                error: { err, mensaje: 'El id ingresado es invalido' }
            })
        }
        res.json({
            ok: true,
            servicio: resp
        })

    })
})


module.exports = app; 