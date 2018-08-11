/**
 * 
 */

const express = require('express');
const _ = require('underscore');

let { verificarToken, verificarAdmin_Role } = require('../middlewares/autentication');

let app = express();

let Categoria = require('../models/categorias');

//Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categorias
            });
        })
});

//mostrar una categoria por id
app.get('/categoria/:id', verificarToken, (req, res) => {
    //Categoria.findById(.....)

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error, id incorecto'
                }
            })
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Crear una nueva categoria
app.post('/categoria', verificarToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//actualizar una categoria
app.put('/categoria/:id', verificarToken, (req, res) => {
    //actualizar la descripcion

    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

//eliminar una categoria
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    //solo un administrador puede borrar una categoria
    //Categoria.findByIdAndRemove(...)

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDel) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error Id incorecto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDel
        })
    });

});





module.exports = app;