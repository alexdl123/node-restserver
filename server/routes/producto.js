/**
 * 
 */

const express = require('express');

const { verificarToken } = require('../middlewares/autentication');

let app = express();

let Producto = require('../models/producto');

//Obtener productos
app.get('/productos', verificarToken, (req, res) => {
    //trae todos lo productos
    //pupulate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre precio descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productos
            });
        })
});

//obtener un producto por ID
app.get('/productos/:id', verificarToken, (req, res) => {
    //pupulate: usuario categoria
    //paginado
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre precio descripcion');
});

//Crear un nuevo producto
app.post('/productos', verificarToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//Actualiza un producto
app.put('/productos/:id', verificarToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria

    let body = req.body;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre precio descripcion')

});

//Elimina un producto
app.delete('/productos/:id', verificarToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria
    let id = req.params.id;
    let body = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

            if (err) {
                return status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre precio descripcion')
});

//Buscar 
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let expReg = new RegExp(termino, 'i');

    Producto.find({ nombre: expReg })
        .populate('categoria', 'nombre precio descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron resultados'
                    }
                });
            }

            return res.json({
                ok: true,
                productos
            });
        })
});
module.exports = app;