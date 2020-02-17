const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Reservacion = require('../models/reservacion');

// ============================
// Mostrar todas las Reservaciones
// ============================
app.get('/reservacion', verificaToken, async (req, res) => {

    await Reservacion.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('personal', 'nombre')
        .exec((err, reservacion) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                reservacion
            });

        })
});

// ============================
// Mostrar una Reservacion por ID
// ============================
app.get('/reservacion/:id', verificaToken, async (req, res) => {
    // Reservacion.findById(....);

    let id = req.params.id;

    await Reservacion.findOne({_id:id}, (err, reservacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!reservacionDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            reservacion: reservacionDB
        });

    });


});

// ============================
// Crear nueva Reservacion
// ============================
app.post('/reservacion', verificaToken, async (req, res) => {
    // regresa la nueva Reservacion
    // req.usuario._id
    let body = req.body;

    let reservacion = new Reservacion({
        fechapedido: body.fechapedido,
        descripcion: body.descripcion,
        personal: body.personal,
        producto: body.producto,
        usuario: req.usuario._id
    });


    await reservacion.save((err, reservacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!reservacionDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            reservacion: reservacionDB
        });


    });


});

// ============================
// actualiza una Reservacion por id
// ============================
app.put('/reservacion/:id', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una Reservacion del listado 

    let id = req.params.id;
    let body = req.body;

    await Reservacion.findOne({_id:id}, (err, reservacionDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!reservacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        reservacionDB.descripcion = body.descripcion;
        reservacionDB.img         = body.img;
        reservacionDB.status      = body.status;
        reservacionDB.fechaStatus = body.fechaStatus;

        reservacionDB.save((err, reservacionGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                reservacion: reservacionGuardado
            });

        });

    });

});

// ============================
// elimina una Reservacion por id
// ============================
app.delete('/reservacion/:id', [verificaToken, verificaAdmin_Role], async (req, res) => {
    // solo un administrador puede borrar Reservacion
    // Reservacion.findByIdAndRemove
    let id = req.params.id;
    // 
    await Reservacion.findOne({_id:id}, (err, reservacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!reservacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        
        reservacionDB.estado = false;

        reservacionDB.save((err, reservacionBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: reservacionBorrado,
                mensaje: 'Reservacion borrado'
            });

        });
        
    });


});


module.exports = app;