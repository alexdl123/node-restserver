/**
 * 
 */
const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {


    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorecta'
                }
            });
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorecta'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })

});

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let userGoogle = await verify(token)
        .catch(e => {
            return status(403).json({
                ok: false,
                err: e
            });
        });


    Usuario.findOne({ email: userGoogle.email }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (usuarioDB) {

                if (usuarioDB.google === false) {

                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Usted ya se autentico'
                        }
                    })
                } else {

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    });
                }
            } else {
                //Si el usuario es nuevo

                let usuario = new Usuario();

                usuario.nombre = userGoogle.nombre;
                usuario.email = userGoogle.email;
                usuario.img = userGoogle.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, usuarioDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    });
                })
            }
        })
        /*
        res.json({
            usuario: userGoogle
        });

        verify(token);
        res.json({
            token
        });*/
});


module.exports = app;