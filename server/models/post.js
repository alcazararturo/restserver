const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let imgSchema = new Schema({ img: { type: String, unique:true }});
imgSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

let posteoSchema = new Schema({
    actividad: { type: Schema.Types.ObjectId, ref: 'Actividad' },
    creado: { type: Date },
    mensaje: { type: String },
    img: [imgSchema],
    coords: {type: String },
    disponible: { type: Boolean, required: true, default: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Posteo', posteoSchema);