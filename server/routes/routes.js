const express = require('express');
// const push = require('./push');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

// Almacenar la suscripción
app.post('/subscribe', verificaToken, async (req,res) => {
   await res.json('subscribe');
});
// key público
app.get('/key', verificaToken, async (req,res) => {
    await res.json('key público');
});
// Enviar una notificación PUSH a las personas que queramos
app.post('/push', verificaToken,async (req,res) => {
    await res.json('push');
});


module.exports = app;