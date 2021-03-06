const express = require('express');
const Objeto = require('../models/Objetos');


const { validacionToken, validacionAdmin } = require('../middleware/validaciones');
const app = express();


app.get('/objeto', validacionToken, (req, res) => {

    Objeto.find({ estado: true }, (err, objeto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            objeto: objeto,
        })

    }).populate('usuario categoria', 'nombreApellido nombre')
});

app.get('/objeto/:id', validacionToken, (req, res) => {

    const id = req.params.id;

    Objeto.findById(id, (err, objeto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (objeto === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Objeto no existe'
                }
            })
        }
        res.json({
            ok: true,
            Objeto: objeto
        })
    }).populate('usuario', 'nombreApellido').populate('categoria', 'nombre')
});



app.post('/objeto', [validacionToken, validacionAdmin], (req, res) => {

    let body = req.body;
    let objeto = new Objeto({
        nombre: body.nombre,
        cantidadDisponible: body.cantidadDisponible,
        precio: body.precio,
        categoria: body.categoria,
        usuario: req.usuario,
        estado: body.estado,
        img: body.img,
    })
    objeto.save((err, nuevoObjeto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            objeto: nuevoObjeto
        })
    })
});


//
app.put('/objeto/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Objeto.findByIdAndUpdate(id, body, { new: true, context: 'query' }, (err, objetoActualizado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (objetoActualizado === null) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            objeto: objetoActualizado
        })
    }).populate('usuario', 'nombreApellido').populate('categoria', 'nombre')
});


// Eliminacion de objetos
app.delete('/objeto/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;

    Objeto.findByIdAndUpdate(id, { estado: false }, { new: true, context: 'query' }, (err, objeto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (objeto === null) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }

        res.json({
            ok: true,
            objetoActualizado: objeto
        })
    })

})

module.exports = app;