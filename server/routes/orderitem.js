const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();

let OrderItem = require('../models/orderitem');

app.use(express.urlencoded({
    extended: true
}));

app.get('/orderitem', verificaToken, async (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    await OrderItem.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('productos', 'title quantity price')
        .exec((err, orderitem) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                orderitem
            });

        });

});

app.get('/orderitem/:id', async (req, res) => {
    // populate: usuario producto
    // paginado
    let id = req.params.id;

    await OrderItem.findOne({_id:id, disponible:true })
       // .populate('usuario', 'nombre email')
       //  .populate('producto', 'nombre')
        .exec((err, orderItemlDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!orderItemlDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                orderitem: orderItemlDB
            });

        });
});

app.post('/orderitem', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una producto del listado 

    let body = req.body;

    // console.log(body);

    let orderitem = new OrderItem({
        usuario: req.usuario._id,
        amount: body.amount,
        productos: body.productos,
        datatime: body.datatime,
        disponible: body.disponible,
        pagos: body.pagos,
        autorizacion: body.autorizacion,
    });

    await orderitem.save((err, orderitemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            orderitem: orderitemDB
        });

    });

});

app.put('/orderitem/:id', verificaToken, async (req, res) => {
    // grabar el usuario
    // grabar una producto del listado 

    let id = req.params.id;
    let body = req.body;

    await OrderItem.findOne({_id:id}, (err, orderitemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!orderitemDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        orderitemDB.amount = body.amount;
        orderitemDB.productos = body.productos;
        orderitemDB.datatime = body.datatime;
        orderitemDB.disponible = body.disponible;
        orderitemDB.pagos = body.pagos;
        orderitemDB.autorizacion = body.autorizacion;

        orderitemDB.save((err, orderitemGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                orderitem: orderitemGuardado
            });

        });

    });

});

app.delete('/orderitem/:id', verificaToken, async (req, res) => {

    let id = req.params.id;

    await OrderItem.findOne({_id:id}, (err, orderitemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!orderitemDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        orderitemDB.disponible = false;

        orderitemDB.save((err, orderitemBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                orderitem: orderitemBorrado,
                mensaje: 'personal borrado'
            });

        });

    });

});

app.get('/orderitem/graph/:start', verificaToken, async (req, res, next) => {

    const start = req.params.start;
    // const end = body.end;

    await OrderItem.aggregate([
        
        {
            $group : {
                _id : null,
                totalSaleAmount: { $sum: "$amount" }
            },
            
        },

        ]).exec(function(error, result) {
            if (error) return next(error);
            res.send(result);   
        });

    
});



module.exports = app;