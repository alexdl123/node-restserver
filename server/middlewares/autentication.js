/**
 * 
 */

const jwt = require('jsonwebtoken');
//----------------------------
//--Verificacion del token----
//----------------------------

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, informacion) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = informacion.usuario;
        next();
    })

}

//----------------------------
//-Verificacion del admin_rol-
//----------------------------

let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    let rol = usuario.role;
    if (rol !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'Se requiere permiso del administrador'
            }
        })
    }
    next();
}




module.exports = {
    verificarToken,
    verificarAdmin_Role
}