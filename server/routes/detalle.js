const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();

let Detalle = require('../models/detalle');
// ============================
// Mostrar todos los detalles de pedidos
// ============================
app.get('/detalle', verificaToken, (req, res) => {
    Detalle.find({ estado: true })
        .sort('item')
        .populate('pedido', 'fechapedido')
        .populate('producto', 'nombre descripcion precioUni')
        .populate('usuario', 'nombre email')
        .exec((err, detalle) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            res.json({ ok: true, detalle });
        });
});
// ============================
// Mostrar un detalle Pedidos por ID
// ============================
app.get('/detalle/:id', verificaToken, (req, res) => {
    // DetallePed.findById(....);
    let id = req.params.id;
    Detalle.findOne({_id:id}, (err, detalleDB) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            if (!detalleDB) { return res.status(500).json({ ok: false, err: { message: 'El ID no es correcto' } }); }
            res.json({ ok: true, detalle: detalleDB });
        }).sort('item')
        .populate('pedido', 'fechapedido')
        .populate('producto', 'nombre descripcion precioUni')
        .populate('usuario', 'nombre email');
});
// ===========================
//  Crear un nuevo detalle pedido
// ===========================
app.post('/detalle', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una Pedido del listado 
    let body = req.body;
    let detalle = new Detalle({
        item: body.item,
        producto: body.producto,
        pedido: body.pedido,
        usuario: req.usuario._id,
        nota: body.nota,
        estado: body.estado,
        cantidadProd: body.cantidadProd
    });
    detalle.save((err, detalleDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); }
        res.status(201).json({ ok: true, detalle: detalleDB });
    });
});
// ============================
// Actualiza un detalle x ID
// ============================
app.put('/detalle/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let usuario = req.usuario._id;

    Detalle.findOne({_id:id}, (err, detalleDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!detalleDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        detalleDB.item = body.item;
        detalleDB.producto = body.producto;
        detalleDB.nota = body.nota;
        detalleDB.cantidadProd = body.cantidadProd;
        detalleDB.usuario = usuario;

        detalleDB.save((err, detalleGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                detalle: detalleGuardado
            });

        });

    });

});
// ===========================
//  Borrar un detalle pedido
// ===========================
app.delete('/detalle/:id', verificaToken, verificaAdmin_Role, (req, res) => {
    let id = req.params.id;
    Detalle.findOne({_id:id}, (err, detalleDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); }
        if (!detalleDB) { return res.status(400).json({ ok: false, err: { message: 'ID no existe' } }); }
        detalleDB.estado = false;
        detalleDB.save((err, detalleBorrado) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            res.json({ ok: true, detalle: detalleBorrado, mensaje: 'Detalle del Pedido borrado' });
        });
    });
});

module.exports = app;