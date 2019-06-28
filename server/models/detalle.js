const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let detalleSchema = new Schema({
    item: { type: Number, required: false },
    pedido: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nota: { type: String, unique: false, required: false },
    estado: { type: Boolean, default: true },
    cantidadProd: { type: Number, required: true }
});

module.exports = mongoose.model('Detalle', detalleSchema);