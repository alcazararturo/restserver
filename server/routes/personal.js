const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Personal = require('../models/personal');

app.use(express.urlencoded({
    extended: true
}));

// ===========================
//  Obtener personal
// ===========================
app.get('/personal', verificaToken, async (req, res) => {
    // trae todo personal
    // populate: usuario produto
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    await Personal.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
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

        });
});

// ===========================
//  Obtener un personal por ID
// ===========================
app.get('/personal/:id', async (req, res) => {
    // populate: usuario producto
    // paginado
    let id = req.params.id;

    await Personal.findOne({_id:id})
       // .populate('usuario', 'nombre email')
       //  .populate('producto', 'nombre')
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
app.get('/personal/buscar/:termino', verificaToken, async (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    await Personal.find({ nombre: regex })
       // .populate('producto', 'nombre')
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

        }); 
});

// ===========================
//  Crear un nuevo personal
// ===========================
app.post('/personal', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una producto del listado 

    let body = req.body;

    console.log(body);

    let personal = new Personal({
        usuario: req.usuario._id,
        nombre: body.nombre,
        email: body.email,
        img: body.img,
        rfc: body.rfc,
        descripcion: body.descripcion,
        voteAverage : body.voteAverage,
        disponible: body.disponible,
        /*productos: body.productos*/
    });

    await personal.save((err, personalDB) => {

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
app.put('/personal/:id', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una producto del listado 

    let id = req.params.id;
    let body = req.body;

    await Personal.findOne({_id:id}, (err, personalDB) => {

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
        personalDB.rfc = body.rfc;
        personalDB.img = body.img;
        personalDB.descripcion = body.descripcion;
        personalDB.voteAverage = body.voteAverage;
        /*personalDB.productos = body.productos;*/

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
app.delete('/personal/:id', verificaToken, async (req, res) => {

    let id = req.params.id;

    await Personal.findOne({_id:id}, (err, personalDB) => {

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

        });

    });

});

module.exports = app;