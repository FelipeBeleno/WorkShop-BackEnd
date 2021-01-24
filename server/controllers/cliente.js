const express = require('express');
const Cliente = require('../models/Clientes');


const { validacionToken, validacionAdmin } = require('../middleware/validaciones');
const app = express();


app.get('/cliente', validacionToken, (req, res) => {

    const page = parseFloat(req.query.page) || 1;

    const limit = parseFloat(req.query.limit) || 20000;

    const opciones = {
        limit,
        page,
        populate: {
            path: 'usuario',
            select: 'nombreApellido'
        }
    }

    Cliente.paginate({ estado: true }, opciones, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            cliente: cliente,
        })
    });
});

app.get('/cliente/:id', validacionToken, (req, res) => {

    const id = req.params.id;
    Cliente.findById(id, (err, cliente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (cliente === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Cliente no existe'
                }
            })
        }
        res.json({
            ok: true,
            cliente: cliente
        })
    }).populate('usuario', 'nombreApellido')
});


app.get('/cliente/cedula/:cedula', validacionToken, (req, res) => {

    const cedula = req.params.cedula;

    Cliente.findOne({ numDocumento: cedula }, (err, cliente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (cliente === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Cliente no existe'
                }
            })
        }
        res.json({
            ok: true,
            cliente: cliente
        })
    }).populate('usuario', 'nombreApellido')
});


app.post('/cliente', validacionToken, (req, res) => {

    let body = req.body;
    let cliente = new Cliente({
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        numDocumento: body.numDocumento,
        usuario: req.usuario
    })
    console.log(cliente)
    cliente.save((err, nuevoCliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            cliente: nuevoCliente
        })
    })
});


//
app.put('/cliente/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Cliente.findByIdAndUpdate(id, body.data, { new: true, context: 'query' }, (err, clienteActualizado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (clienteActualizado === null) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            cliente: clienteActualizado
        })
    }).populate('usuario', 'nombreApellido').populate('categoria', 'nombre')
});


// Eliminacion de objetos
app.delete('/cliente/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;

    Cliente.findByIdAndUpdate(id, { estado: false }, { new: true, context: 'query' }, (err, cliente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (cliente === null) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            clienteActualizado: cliente
        })
    })

})

module.exports = app;