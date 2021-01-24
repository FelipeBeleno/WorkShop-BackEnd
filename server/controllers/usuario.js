const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

const Usuario = require('../models/Usuarios');
const { validacionToken, validacionAdmin } = require('../middleware/validaciones');



//consulta de usuarios
app.get('/usuario', [validacionToken, validacionAdmin], (req, res) => {

    const pages = parseFloat(req.query.page) || 1;

    const limite = parseFloat(req.query.limit) || 20;

    const opciones = {
        limit: limite,
        page: pages,
    }

    Usuario.paginate({ estado: true }, opciones, (err, datos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            datos
        })
    })




});



//Consulta de un solo usuario
app.get('/usuario/:id', validacionToken, (req, res) => {

    const id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })

        }

        res.json({
            ok: true,
            usuario
        })
    })

})

//Creacion de usuario
app.post('/usuario', (req, res) => {

    const body = req.body;

    const usuario = new Usuario({
        nombreApellido: body.nombreApellido,
        documento: body.documento,
        contraseña: bcrypt.hashSync(body.contraseña, 10),
        img: body.img,
        role: body.role,

    })

    usuario.save((err, usuarioNuevo) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            nuevoUsuario: usuarioNuevo
        })
    })


})


//Actualizacion de usuario
app.put('/usuario/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;
    const body = req.body;


    Usuario.findByIdAndUpdate(id, body, { new: true, context: 'query' }, (err, usuarioActualizado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (usuarioActualizado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'Id invalido'
                }
            })
        }

        res.json({
            ok: true,
            Usuario: usuarioActualizado
        })
    })

})

//Cambio de estado de usuario
app.delete('/usuario/:id', [validacionToken, validacionAdmin], (req, res) => {

    const id = req.params.id;


    Usuario.findByIdAndUpdate(id, { estado: false }, (err, cambioEstado) => {
        if (err) {
            return res.json({
                ok: false,
                error: err
            });
        }
        if (cambioEstado === null) {
            return res.json({
                ok: false,
                error: {
                    message: 'El id es invalido'
                }
            });
        }
        res.json({
            ok: true,
            usuarioEliminado: cambioEstado
        })
    })

});



module.exports = app;