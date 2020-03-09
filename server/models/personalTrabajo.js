const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let personalTrabajoSchema = new Schema({
    personal: { type: Schema.Types.ObjectId, ref: 'Personal' },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fotos: [{ type: String, required: false }],
    disponible: { type: Boolean, required: true, default: true }
});


module.exports = mongoose.model('PersonalTrabajo', personalTrabajoSchema);