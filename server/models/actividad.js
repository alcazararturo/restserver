const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let actividadSchema = new Schema({
    creado: { type: Date },
    actividad: { type: String, unique: true, required: [true, 'La actividad es obligatoria'] },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    finalizado: {type: Date },    
    email: [{ type: String, unique: true }],
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Actividad', actividadSchema);