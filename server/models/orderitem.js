var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let CartItem = require('../models/cartitem');

let pagosValidos = {
    values: ['cash', 'tc', 'td', 'tr'],
    message: '{VALUE} no es un rol válido'
};

var OrderItemSchema = new Schema({
    amount: { type: Number, required: [true, 'El precio es necesario'] },
    productos: [CartItem],
    datatime: { type: Date },
    disponible: { type: Boolean, required: true, default: true },
    pagos: { type: String, default: 'cash', enum: pagosValidos },
    autorizacion: {type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);