var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartItemSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
    title: { type: String, required: [true, 'El nombre es necesario'] },
    quantity: { type: Number, required: [true, 'La cantidad es necesario'] },
    price: { type: Number, required: [true, 'El precio es necesario'] },
    disponible: { type: Boolean, required: true, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('CartItem', cartItemSchema);