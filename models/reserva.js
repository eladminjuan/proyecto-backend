// models/reserva.js

const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    idusuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    idhabitacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Habitacion', required: true },
    fechaIngreso: { type: Date, required: true },
    fechaSalida: { type: Date, required: true },
    valorTotal: { type: Number, required: true },
    numTransaccion: { type: String },
    facturacion: { type: String },
    metodoPago: { type: String },
    estado: { type: String, required: true, default: 'Pendiente' },
    fecha: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reserva', reservaSchema);
