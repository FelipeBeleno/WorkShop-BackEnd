const express = require('express');
const Categotia = require('../models/Categorias');


const { validacionToken, validacionAdmin } = require('../middleware/validaciones');
const app = express();


app.get('/categoria', validacionToken, (req, res) => {


    Categotia.find({ estado: true }, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            categoria
        })
    }).populate('usuario', 'nombreApellido')
});

app.get('/categoria/:id', validacionToken, (req, res) => {

    const id = req.params.id;

    Categotia.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'categoria no existe'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoria
        })
    }).populate('usuario', 'nombreApellido')
});

app.post('/categoria', [validacionToken, validacionAdmin], (req, res) => {
    const body = req.body;

    const categoria = new Categotia({
        nombre: body.nombre,
        usuario: req.usuario
    });

    categoria.save((err, categoriaNueva) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaNueva
        })
    })
});

app.put('/categoria/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;
    const body = req.body;


    Categotia.findByIdAndUpdate(id, body, { new: true, context: 'query' }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (categoriaActualizada === null) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaActualizada
        })
    }).populate('usuario', 'nombreApellido')
});

app.delete('/categoria/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;

    Categotia.findByIdAndUpdate(id, { estado: false }, { new: true, context: 'query' }, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            categoriaEliminada: categoria
        })
    })

})

module.exports = app;