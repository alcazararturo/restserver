const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let deviceSchema = new Schema({ idDevice: { type: String, unique:true }}); 

let userDeviceSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', unique: true },
    estado : { type: Boolean, default: true },
    device : [ deviceSchema ]
});
//  { idDevice: String } ]
userDeviceSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('UserDevice', userDeviceSchema);