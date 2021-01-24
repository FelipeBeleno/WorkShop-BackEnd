const express = require('express');


const { validacionToken } = require('../middleware/validaciones');
const { findById } = require('../models/Procedimientos');
const Procedimiento = require('../models/Procedimientos');

const app = express();


app.get('/procedimiento', (req, res) => {
    Procedimiento.find((err, procedimiento) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            procedimiento
        })
    })
});


app.post('/procedimiento', validacionToken, (req, res) => {

    const body = req.body

    const procedimiento = new Procedimiento({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio,
        usuario: req.usuario
    })

    procedimiento.save((err, procedimiento) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            procedimiento
        })
    })


});


app.put('/procedimiento/:id', validacionToken, (req, res) => {
    const id = req.params.id
    const body = req.body;

    Procedimiento.findByIdAndUpdate(id, body, { new: true, context: 'query' }, (err, procedimiento) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (procedimiento === null || procedimiento === undefined) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            procedimiento
        })
    })
});

app.delete('/procedimiento/:id', validacionToken, (req, res) => {

    const id = req.params.id

    Procedimiento.findByIdAndDelete(id, (err, documentoElimindo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (documentoElimindo === null || documentoElimindo === undefined) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            documentoElimindo
        })
    })
})

module.exports = app;