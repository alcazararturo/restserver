const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();

let CartItem = require('../models/cartitem');

app.use(express.urlencoded({
    extended: true
}));

app.get('/cartitem/:id', verificaToken, async (req, res) => {

    let id = req.params.id;

    await CartItem.findOne({_id:id, disponible:true })
        .populate('usuario', 'nombre email')
        .populate('producto', 'nombre precioUni descripcion')
        .exec((err, cartitemDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!cartitemDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                cartitem: cartitemDB
            });


        });


});

app.post('/cartitem', verificaToken, async (req, res) => {

    let body = req.body;
    console.log(body);

    let cartitem = new CartItem({
        usuario: req.usuario._id,
        producto: body.producto,
        title: body.title,
        quantity: body.quantity,
        price: body.price,
        disponible: body.disponible,
    });

    await cartitem.save((err, cartitemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            cartitem: cartitemDB
        });
    });

});

app.put('/cartitem/:id', verificaToken, async (req, res) => {

    let id = req.params.id;
    let body = req.body;

    await CartItem.findOne({_id:id}, (err, cartitemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cartitemDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        cartitemDB.title = body.title;
        cartitemDB.producto = body.producto;
        cartitemDB.quantity = body.quantity;
        cartitemDB.price = body.price;
        cartitemDB.disponible = body.disponible;

        cartitemDB.save((err, cartitemGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cartitem: cartitemGuardado
            });

        });



    });

});

app.delete('/cartitem/:id', verificaToken, async (req, res) => {

    let id = req.params.id;

    await CartItem.findOne({_id:id}, (err, cartitemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cartitemDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        cartitemDB.disponible = false;

        cartitemDB.save((err, cartitemBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cartitem: cartitemBorrado,
                mensaje: 'personal borrado'
            });

        });

    });

});


module.exports = app;