const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        default: []
    },
    foto: { type: Buffer },
    telefono: { type: String, required: true },
    tipdocu: { type: String, required: true },
    numdocu: { type: String, required: true, unique: true },
    pais: { type: String },
    estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    fecha: { type: String, required: true }
});



module.exports = mongoose.model('Usuario', usuarioSchema);
