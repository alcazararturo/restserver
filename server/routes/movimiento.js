const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


var app = express();
var Movimiento = require('../models/movimiento');

app.get('/movimiento', verificaToken, async (req, res) => {

    // trae todo personal
    // populate: usuario produto
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    await Movimiento.find({ status: true })
        .skip(desde)
        .limit(5)
       // .populate('usuario', 'nombre email')
       // .populate('producto', 'nombre')
        .exec((err, movimiento) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                movimiento
            });


        });

});


module.exports = app;
