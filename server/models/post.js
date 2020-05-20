const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let posteoSchema = new Schema({
    actividad: { type: Schema.Types.ObjectId, ref: 'Actividad' },
    creado: { type: Date },
    mensaje: { type: String },
    img: [{ type: String }],
    coords: {type: String },
    disponible: { type: Boolean, required: true, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Posteo', posteoSchema);