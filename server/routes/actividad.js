const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Actividad = require('../models/actividad');

// ============================
// Mostrar todas las actividad
// ============================
app.get('/actividad', verificaToken, async(req, res) => {

    await Actividad.find({})
        .sort('actividad')
        .populate('usuario', 'nombre email')
        .exec((err, actividad) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                actividad
            });

        });
});

// ============================
// Mostrar una actividad por ID
// ============================
app.get('/actividad/:id', verificaToken, async (req, res) => {
    // actividad.findById(....);

    let id = req.params.id;

    await Actividad.findOne({_id:id}, (err, actividadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!actividadDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            actividad: actividadDB
        });

    });

});

app.get('/actividad/email/:id', verificaToken, async (req, res) => {
    // actividad.findById(....);
    let email = req.params.id;

    await Actividad.find(
        {email:email, disponible:true}, 'actividad descripcion img creado email')
        .sort('actividad')
        .exec((err, actividadDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if (!actividadDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }
    
            res.json({
                ok: true,
                actividad: actividadDB
            });
        });

});

// ============================
// Crear nueva actividad
// ============================
app.post('/actividad', verificaToken, async (req, res) => {
    // regresa la nueva actividad
    // req.usuario._id
    let body = req.body;

    let actividad = new Actividad({
        usuario: req.usuario._id,
        creado: new Date(),
        actividad: body.actividad,
        email: [req.body.email],
        descripcion: req.body.descripcion,
        img: req.body.img
    });

    await actividad.save((err, actividadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!actividadDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividad: actividadDB
        });

    });

});

// ============================
// actualiza una actividad por id
// ============================
app.put('/actividad/:id', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una actividad del listado 

    let id = req.params.id;
    let body = req.body;

    await Actividad.findOne({_id:id}, (err, actividadDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!actividadDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        actividadDB.actividad   = body.actividad;
        actividadDB.descripcion = body.descripcion;
        actividadDB.img         = body.img;
        actividadDB.email       = body.email;

        actividadDB.save((err, actividadGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                actividad: actividadGuardado
            });

        });

    });

});


// ============================
// elimina una actividad por id
// ============================
app.delete('/actividad/:id', [verificaToken, verificaAdmin_Role], async (req, res) => {
    let id = req.params.id;

    await Actividad.findOne({_id:id}, (err, actividadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!actividadDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        actividadDB.disponible = false;
        actividadDB.finalizado = new Date();

        actividadDB.save((err, actividadBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                actividad: actividadBorrado,
                mensaje: 'Actividad borrada'
            });

        });

    });


});


module.exports = app;