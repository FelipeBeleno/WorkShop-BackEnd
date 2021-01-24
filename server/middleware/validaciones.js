const jwt = require('jsonwebtoken');


const validacionToken = (req, res, next) => {

    // de esta manera se puede obtener los tokens que se envian por el header
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, usuario) => {
        if (err) {

            return res.json({
                ok: false,
                err
            })
        }

        req.usuario = usuario.usuario
        next()

    })
}

const revalidarTokenYCrearNuevo = (req, res, next) => {
    const token = req.header('token')

    if (!token) {
        return res.status(400).json({
            ok: false,
            error: {
                mensaje: 'No ha enviado ningun token '
            }
        })
    }


    try {
        const info = jwt.verify(token, process.env.SEED)
        console.log(info)

    } catch (error) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Token no valido'
        })
    }


}


const validacionAdmin = (req, res, next) => {

    const usuario = req.usuario
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json(400, {
            ok: false,
            mensaje: 'No tiene permisos para estar en este servicio'
        })
    }

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }

}

module.exports = {
    validacionToken,
    validacionAdmin,

}