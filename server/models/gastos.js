var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let pagosValidos = {
    values: ['generales', 'renta', 'luz', 'agua', 'limpieza', 'vigilancia'],
    message: '{VALUE} no es un rol válido'
};

var OrderItemSchema = new Schema({
    datatime: { type: Date },
    amount: { type: Number, required: [true, 'El precio es necesario'] },
    gasto: { type: String, default: 'cash', enum: pagosValidos },
    descripcion: { type: String },
    disponible: { type: Boolean, required: true, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);