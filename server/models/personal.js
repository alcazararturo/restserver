const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let personalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email:  { type: String, unique: true, required: [true, 'El correo es necesario'] },
    img: { type: String, required: false },
    rfc: { type: String, required: false},
    descripcion: { type: String, required: false},
    disponible: { type: Boolean, default: true },
    productos: [ { type: Schema.Types.ObjectId, ref: 'Producto' } ],
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

personalSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Personal', personalSchema);