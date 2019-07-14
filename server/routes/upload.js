const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const fs = require('fs');
const path = require('path');


// default options
// app.use(fileUpload());
app.use( fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios', 'categorias'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    // 183912kuasidauso-123.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aqui, imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        } else {
            imagenCategoria(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuaro no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });


}



function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });


    });


}

function imagenCategoria(id, res, nombreArchivo) {

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'categorias');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            borraArchivo(nombreArchivo, 'categorias');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no existe'
                }
            });
        }

        borraArchivo(categoriaDB.img, 'categorias')

        categoriaDB.img = nombreArchivo;

        categoriaDB.save((err, categoriaGuardado) => {

            res.json({
                ok: true,
                categoria: categoriaGuardado,
                img: nombreArchivo
            });

        });


    });


}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }


}

module.exports = app;