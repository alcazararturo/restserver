const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let PersonalTrabajo = require('../models/personalTrabajo');

app.use(express.urlencoded({
    extended: true
}));

// ===========================
//  Obtener personal trabajos
// ===========================
app.get('/personaltrabajo', verificaToken, async (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    await PersonalTrabajo.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion img')
        .exec((err, personaltrabajo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personaltrabajo
            });

        });
});

// ===========================
//  Obtener un personal por personal y categoria
// ===========================
app.get('/personaltrabajo/:personal&:categoria', async (req, res) => {
    
    let personal  = req.params.personal;
    let categoria = req.params.categoria;

    await PersonalTrabajo.findOne({personal:personal, categoria:categoria})
        .exec((err, personaltrabajoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!personaltrabajoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                personaltrabajo: personaltrabajoDB.fotos
            });

        });

});

// ===========================
//  Obtener un personal por personal
// ===========================
app.get('/personaltrabajo/:personal', async (req, res) => {
    
    let personal  = req.params.personal;

    await PersonalTrabajo.find({personal:personal})
        .populate('categoria', 'descripcion img')   
        .exec((err, personaltrabajoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!personaltrabajoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                personaltrabajo: personaltrabajoDB
            });

        });

});

// ===========================
//  Buscar personal
// ===========================
app.get('/personaltrabajo/buscar/:termino', verificaToken, async (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    await PersonalTrabajo.find({ nombre: regex })
        .exec((err, personaltrabajo) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personaltrabajo
            });

        });
        
});

// ===========================
//  Crear un nuevo personal
// ===========================
app.post('/personaltrabajo', verificaToken, async (req, res) => {

    let body = req.body;

    let personaltrabajo = new PersonalTrabajo({
        usuario: req.usuario._id,
        personal: body.personal,
        categoria: body.categoria,
        fotos: body.fotos
    });

    await personaltrabajo.save((err, personaltrabajoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            personaltrabajo: personaltrabajoDB
        });

    });

});

// ===========================
//  Actualizar un personal
// ===========================
app.put('/personaltrabajo/:id', verificaToken, async (req, res) => {

    let id = req.params.id;
    let body = req.body;

    await PersonalTrabajo.findOne({_id:id}, (err, personaltrabajoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!personaltrabajoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        personaltrabajoDB.categoria = body.categoria;
        personaltrabajoDB.fotos = body.fotos;

        personaltrabajoDB.save((err, personaltrabajoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personal: personaltrabajoGuardado
            });

        });

    });


});

// ===========================
//  Borrar un personal
// ===========================
app.delete('/personaltrabajo/:id', verificaToken, async (req, res) => {

    let id = req.params.id;

    await PersonalTrabajo.findOne({_id:id}, (err, personaltrabajoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!personaltrabajoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        personaltrabajoDB.disponible = false;

        personaltrabajoDB.save((err, personaltrabajoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                personaltrabajo: personaltrabajoBorrado,
                mensaje: 'personal trabajo borrado'
            });

        });

    });


});


module.exports = app;