const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tipoValidos = {
    values: ['ENTRADA', 'SALIDA',],
    message: '{VALUE} no es un tipo válido'
};

let statusValidos = {
    values: ['ACTIVO', 'NO_ACTIVO'],
    message: '{VALUE} no es un status válido'
};

let movimientoSchema = new Schema({
	fecha: { type: Date, required: true },
	descripcion: { type: String, unique: false, required: [true, 'La descripción es obligatoria'] },
	cantidad: { type: Number, required: true },
	tipo: { type: String, required: true, default: 'ENTRADA', enum: tipoValidos },
	status: { type: String, required: true, default: 'ACTIVO', enum: statusValidos },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    pedido: { type: Schema.Types.ObjectId, ref: 'Pedido', required: false }
});

module.exports = mongoose.model('Movimiento', movimientoSchema);