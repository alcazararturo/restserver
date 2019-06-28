const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let statusValidos = {
    values: ['PEDIDO', 'EN_PROCESO', 'ENVIADO', 'TERMINADO'],
    message: '{VALUE} no es un status válido'
};

let pedidoSchema = new Schema({
    fechapedido: { type: Date, required: true },
    descripcion: { type: String, unique: false, required: [true, 'La descripción es obligatoria'] },
    estado: { type: Boolean, default: true },
    status: { type: String, required: true, default: 'PEDIDO', enum: statusValidos },
    fechaStatus: { type: Date, required: false },
    cantidadProd: { type: Number, required: false },
    precio: { type: Number, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Pedido', pedidoSchema);