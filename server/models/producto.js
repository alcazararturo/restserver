var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let generoValido = {
    values: ['DAMA', 'CABALLERO'],
    message: '{VALUE} no es un género válido'
};

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    genero: { type: String, default: 'DAMA', enum: generoValido, required: false},
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Producto', productoSchema);