const express = require('express');

const UserDevice = require('../models/userDevice');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/userDevice', verificaToken, async (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    await UserDevice.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, userDevice) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            UserDevice.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    userDevice,
                    cuantos: conteo
                });
            });
        });
});

app.get('/userDevice/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    UserDevice.findOne({usuario:id}, (err, userDeviceDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDeviceDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            userDevice: userDeviceDB
        });
    });
});

app.post('/userDevice', verificaToken, async function(req, res) {

    let body = req.body;
    let usuario = req.usuario;
    let device = [{'idDevice':body.device}];

    console.log(usuario);
    console.log(device);

    await UserDevice.findOne({'usuario':usuario}, async ( err, userDeviceDB ) => {
                                
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !userDeviceDB ) {
            let userDevice = new UserDevice({
                usuario : usuario,
                device : device
            });

            await userDevice.save( (err, userDeviceDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    userDevice: userDeviceDB
                });
            });
        } else {

            await UserDevice.findOneAndUpdate({'usuario':usuario}, { $push: { device: device }}, (err, userDeviceAdd) => {
    
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                res.json({
                    ok: true,
                    userDevice: userDeviceAdd,
                    mensaje: 'Device Add'
                });
            });

        }
    });
});

app.delete('/userDevice/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    UserDevice.findOne({usuario:id}, (err, userDeviceDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDeviceDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        userDeviceDB.estado = false;

        userDeviceDB.save((err, userDeviceBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                userDevice: userDeviceBorrado,
                mensaje: 'Usuario borrado'
            });

        });

    });

});

module.exports = app;



