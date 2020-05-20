const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./pedido'));
app.use(require('./detalle'));
app.use(require('./personal'));
app.use(require('./personalTrabajo'));
app.use(require('./reservacion'));
app.use(require('./routes'));
app.use(require('./userDevice'));
app.use(require('./cartitem'));
app.use(require('./orderitem'));
app.use(require('./actividad'));
app.use(require('./avatar'));
app.use(require('./post'));

module.exports = app;