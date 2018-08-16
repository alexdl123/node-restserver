/**
 * 
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { verificarTokenImg } = require('../middlewares/autentication');

let app = express();

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagenPath = path.resolve(__dirname, '../assets/escudo.png');
        res.sendFile(noImagenPath);
    }

});





module.exports = app;