const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let personal = require('../models/personal');


// ===========================
//  Obtener personal
// ===========================
app.get('/personal', verificaToken, (req, res) => {
    // trae todo personal
    // populate: usuario produto
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    personal.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('producto', 'nombre')
        .exec((err, personal) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personal
            });


        })

});

// ===========================
//  Obtener un personal por ID
// ===========================
app.get('/personal/:id', (req, res) => {
    // populate: usuario producto
    // paginado
    let id = req.params.id;

    personal.findOne({_id:id})
        .populate('usuario', 'nombre email')
        .populate('producto', 'nombre')
        .exec((err, personalDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!personalDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                personal: personalDB
            });

        });

});

// ===========================
//  Buscar personal
// ===========================
app.get('/personal/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    personal.find({ nombre: regex })
        .populate('producto', 'nombre')
        .exec((err, personal) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personal
            })

        })


});



// ===========================
//  Crear un nuevo personal
// ===========================
app.post('/personal', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una producto del listado 

    let body = req.body;

    let personal = new personal({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        genero: body.genero,
        disponible: body.disponible,
        producto: body.producto
    });

    personal.save((err, personalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            personal: personalDB
        });

    });

});

// ===========================
//  Actualizar un personal
// ===========================
app.put('/personal/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una producto del listado 

    let id = req.params.id;
    let body = req.body;

    personal.findOne({_id:id}, (err, personalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!personalDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        personalDB.nombre = body.nombre;
        personalDB.precioUni = body.precioUni;
        personalDB.producto = body.producto;
        personalDB.genero = body.genero;
        personalDB.disponible = body.disponible;
        personalDB.descripcion = body.descripcion;

        personalDB.save((err, personalGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personal: personalGuardado
            });

        });

    });


});

// ===========================
//  Borrar un personal
// ===========================
app.delete('/personal/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    personal.findOne({_id:id}, (err, personalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!personalDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        personalDB.disponible = false;

        personalDB.save((err, personalBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personal: personalBorrado,
                mensaje: 'personal borrado'
            });

        })

    });


});






module.exports = app;