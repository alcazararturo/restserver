const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Avatar = require('../models/avatar');

// ============================
// Mostrar todas las avatar
// ============================
app.get('/avatar', verificaToken, async(req, res) => {

    await Avatar.find({}, 'descripcion img')
        .sort('descripcion')
        .exec((err, avatar) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                avatar
            });

        });
});

// ============================
// Mostrar una avatar por ID
// ============================
app.get('/avatar/:id', verificaToken, async (req, res) => {
    // avatar.findById(....);

    let id = req.params.id;

    await Avatar.findOne({_id:id}, (err, avatarDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!avatarDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            avatar: avatarDB
        });

    });

});

// ============================
// Crear nueva avatar
// ============================
app.post('/avatar', verificaToken, async (req, res) => {
    // regresa la nueva avatar
    // req.usuario._id
    let body = req.body;

    let avatar = new Avatar({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        img: req.body.img
    });

    await avatar.save((err, avatarDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!avatarDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            avatar: avatarDB
        });

    });

});

// ============================
// actualiza una avatar por id
// ============================
app.put('/avatar/:id', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una avatar del listado 

    let id = req.params.id;
    let body = req.body;

    await Avatar.findOne({_id:id}, (err, avatarDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!avatarDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        avatarDB.descripcion = body.descripcion;
        avatarDB.img         = body.img;

        avatarDB.save((err, avatarGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                avatar: avatarGuardado
            });

        });

    });

});

// ============================
// elimina una avatar por id
// ============================
app.delete('/avatar/:id', [verificaToken, verificaAdmin_Role], async (req, res) => {
    // solo un administrador puede borrar avatar
    // avatar.findByIdAndRemove
    let id = req.params.id;
    // 
    await Avatar.remove({_id:id}, (err, avatarDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!avatarDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        
        return res.json({
                ok: true,
                message: 'avatar Borrada'
        });

        

    });

});


module.exports = app;