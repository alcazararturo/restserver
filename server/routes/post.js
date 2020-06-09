const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Posteo = require('../models/post');

// ============================
// Mostrar todas las post
// ============================
app.get('/post', verificaToken, async(req, res) => {

    await Posteo.find({})
        .sort('creado')
        .populate('usuario', 'nombre email')
        .exec((err, postDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                postDB
            });

        });
});

// ============================
// Mostrar una post por ID
// ============================
app.get('/post/:id', verificaToken, async (req, res) => {
    // post.findById(....);

    let id = req.params.id;

    await Posteo.findOne({_id:id}, (err, postDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!postDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            post: postDB
        });

    });

});

app.get('/post/actividad/:actividad', verificaToken, async (req, res) => {
   
    let actividad = req.params.actividad;

    await Posteo.find({actividad:actividad, disponible:true}, (err, postDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!postDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            post: postDB
        });

    });

});

// ============================
// Crear nueva post
// ============================
app.post('/post', verificaToken, async (req, res) => {
    // regresa la nueva post
    // req.usuario._id
    let body = req.body;

    let post = new Posteo({
        usuario: req.usuario._id,
        actividad: body.actividad,
        mensaje: body.mensaje,
        img: [body.img],
        coords: body.coords,
        creado: new Date(),
    });

    await post.save((err, postDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!postDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            post: postDB
        });

    });

});

// ============================
// actualiza una post por id
// ============================
app.put('/post/:id', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una post del listado 

    let id = req.params.id;
    let body = req.body;

    await Posteo.findOne({_id:id}, (err, postDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!postDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        postDB.mensaje = body.mensaje;
        postDB.img = body.img;
        postDB.coords = body.coords;

        postDB.save((err, postGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                post: postGuardado
            });

        });

    });

});

// ============================
// elimina una post por id
// ============================
app.delete('/post/:id', [verificaToken, verificaAdmin_Role], async (req, res) => {
    let id = req.params.id;

    await Posteo.findOne({_id:id}, (err, postDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!postDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        postDB.disponible = false;

        postDB.save((err, postBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                post: postBorrado,
                mensaje: 'Registro borrado'
            });

        });

    });


});


module.exports = app;