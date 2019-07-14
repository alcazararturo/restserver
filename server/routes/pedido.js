const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();

let Pedido = require('../models/pedido');
// ============================
// Mostrar todos los pedidos
// ============================
app.get('/pedido', verificaToken, (req, res) => {
    Pedido.find({ estado: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, pedidos) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            res.json({ ok: true, pedidos });
        });
});
// ============================
// Mostrar un pedido por ID
// ============================
app.get('/pedido/:id', verificaToken, (req, res) => {
    // Categoria.findById(....);
    let id = req.params.id;
    Pedido.findById(id, (err, pedidoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); }
        if (!pedidoDB) { return res.status(500).json({ ok: false, err: { message: 'El ID no es correcto' } }); }
        res.json({ ok: true, pedido: pedidoDB });
    });
});
// ============================
// Crear nuevo pedido
// ============================
app.post('/pedido', verificaToken, (req, res) => {
    // regresa el nuevo pedido
    // req.usuario._id
    let body = req.body;
    let pedido = new Pedido({
        fechapedido: new Date(),
        descripcion: body.descripcion,
        estado: body.estado,
        status: body.status,
        usuario: req.usuario._id
    });
    pedido.save((err, pedidoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); }
        if (!pedidoDB) {
            return res.status(400).json({ ok: false, err });
        }
        res.json({ ok: true, pedido: pedidoDB });
    });
});
// ============================
// Actualiza un pedido x ID
// ============================
app.put('/pedido/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let usuario = req.usuario._id;

    Pedido.findById(id, (err, pedidoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pedidoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        pedidoDB.descripcion = body.descripcion;
        pedidoDB.status = body.status;
        pedidoDB.fechaStatus = body.categoria;
        pedidoDB.cantidadProd = body.cantidadProd;
        pedidoDB.precio = body.precio;
        pedidoDB.usuario = usuario;

        pedidoDB.save((err, pedidoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pedido: pedidoGuardado
            });

        });

    });
});
// ===========================
//  Borrar un pedido
// ===========================
app.delete('/pedido/:id', verificaToken, verificaAdmin_Role, (req, res) => {
    let id = req.params.id;
    Pedido.findById(id, (err, pedidoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); }
        if (!pedidoDB) { return res.status(400).json({ ok: false, err: { message: 'ID no existe' } }); }
        pedidoDB.estado = false;
        pedidoDB.save((err, pedidoBorrado) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            res.json({ ok: true, producto: pedidoBorrado, mensaje: 'Pedido borrado' });
        });
    });
});

module.exports = app;