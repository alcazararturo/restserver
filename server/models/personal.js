var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email:  { type: String, required: [true, 'El correo es necesario'] },
    img: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    producto: { Array(type: Schema.Types.ObjectId), ref: 'Producto', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('personal', personalSchema);