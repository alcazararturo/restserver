const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let statusValidos = {
    values: ['RESERVACÍON', 'EN_PROCESO', 'TERMINADO'],
    message: '{VALUE} no es un status válido'
};

let reservacionSchema = new Schema({
    fechapedido: { type: Date, required: true },
    descripcion: { type: String, unique: false, required: [true, 'La descripción es obligatoria'] },
    estado     : { type: Boolean, default: true },
    status     : { type: String, required: true, default: 'RESERVACÍON', enum: statusValidos },
    fechaStatus: { type: Date, required: false },
    personal   : { type: Schema.Types.ObjectId, ref: 'Personal' },
    producto   : { type: Schema.Types.ObjectId, ref: 'Producto' },
    usuario    : { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Reservacion', reservacionSchema);