const express = require('express');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuarios');

const { validacionToken } = require('../middleware/validaciones')


const app = express();

app.post('/login', (req, res) => {

    const body = req.body;


    Usuario.findOne({ documento: body.documento }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,

            })
        }
        if (usuario === null) {
            return res.json({
                ok: false,
                mensaje: 'Documento o contraseña invalido'
            })
        }



        if (!bcrypt.compareSync(body.contraseña, usuario.contraseña)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Documento o contraseña invalido'
            })

        }

        const token = jwt.sign(
            { usuario: usuario },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN })



        res.json({
            ok: true,
            Usuario: usuario,
            token,

        })

    })

});
app.get('/login', validacionToken, (req, res) => {


    const usuario = req.usuario


    const token = jwt.sign(
        { usuario: usuario },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN })



    res.json({ ok: true, token, Usuario: usuario })
})

module.exports = app;