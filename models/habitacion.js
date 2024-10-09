const mongoose = require('mongoose');

const habitacionSchema = new mongoose.Schema({
    estilo: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true,
        unique: true
    },
    capacidad: {
        type: Number,
        required: true
    },
    slug: {
        type: String,
        required: false
    },
    foto: {
        type: Buffer,
        required: true
    },
    video: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['Disponible', 'Ocupada', 'Mantenimiento'],
        default: 'Disponible'
    },
    fecha: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Habitacion', habitacionSchema);
