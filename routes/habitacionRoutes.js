const express = require('express');
const router = express.Router();
const Habitacion = require('../models/habitacion');
const multer = require('multer');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Crear una nueva habitacion
router.post('/habitaciones', upload.single('foto'), async (req, res) => {
    const { estilo, numero, capacidad, slug, video, descripcion, precio, estado, fecha } = req.body;
    const foto = req.file.buffer;
    try {
        const habitacion = new Habitacion({ estilo, numero, capacidad, slug, foto, video, descripcion, precio, estado, fecha });
        await habitacion.save();
        res.status(201).send(habitacion);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Obtener todas las habitaciones
router.get('/habitaciones', async (req, res) => {
    const habitaciones = await Habitacion.find().sort({ fecha: -1 }).lean();
    habitaciones.forEach(habitacion => {
        if (habitacion.foto) {
            habitacion.foto = habitacion.foto.toString('base64');
        }
    });
    res.json(habitaciones);
});

router.get('/habitaciones/count', async (req, res) => {
    try {
        const count = await Habitacion.countDocuments();
        res.status(200).json(count);
    } catch (err) {
        res.status(500).send('Error al obtener la cantidad de habitaciones');
    }
});


// Obtener una habitacion por ID
router.get('/habitaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const habitacion = await Habitacion.findById(id);
        if (!habitacion) {
            return res.status(404).send('Habitación no encontrada');
        }
        res.status(200).send(habitacion);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Actualizar una habitacion por ID
router.put('/habitaciones/:id', upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const { estilo, numero, capacidad, slug, video, descripcion, precio, estado } = req.body;
    const updateFields = { estilo, numero, capacidad, slug, video, descripcion, precio, estado };

    if (req.file) {
        updateFields.foto = req.file.buffer;
    }

    try {
        const habitacion = await Habitacion.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
        if (!habitacion) {
            return res.status(404).send('Habitación no encontrada');
        }
        res.status(200).send(habitacion);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Eliminar una habitacion por ID
router.delete('/habitaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const habitacion = await Habitacion.findByIdAndDelete(id);
        if (!habitacion) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        res.status(200).json({ message: 'Habitación eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la habitación' });
    }
});

module.exports = router;
