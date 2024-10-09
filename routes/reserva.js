const express = require('express');
const router = express.Router();
const Reserva = require('../models/reserva');
const auth = require('../middleware/auth'); // Middleware para verificar la autenticación

// Crear una nueva reserva
router.post('/reservas', async (req, res) => {
    try {
        const { idusuario, idhabitacion, fechaIngreso, fechaSalida, valorTotal } = req.body;
        const reserva = new Reserva({
            idusuario,
            idhabitacion,
            fechaIngreso,
            fechaSalida,
            valorTotal,
            numTransaccion: '',
            facturacion: '',
            metodoPago: '',
            estado: 'Pendiente',
            fecha: new Date().toLocaleString() // Ajusta esto según tu formato de fecha preferido
        });

        await reserva.save();
        res.status(201).json(reserva);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reserva', error });
    }
});

// Obtener reservas pendientes por usuario
router.get('/reservas/pendientes/:userId', async (req, res) => {
    try {
        const reservas = await Reserva.find({ idusuario: req.params.userId, estado: 'Pendiente' }).populate('idhabitacion');
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/reservas/:userId', async (req, res) => {
    try {
        const reservas = await Reserva.find({ idusuario: req.params.userId, estado: 'Reservado' || 'Cancelado' }).populate('idhabitacion');
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar reserva
router.delete('/reservas/:id', async (req, res) => {
    try {
        await Reserva.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reserva eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/reservas/check-availability', async (req, res) => {
    const { idhabitacion, fechaIngreso, fechaSalida } = req.query;

    try {
        const reservas = await Reserva.find({
            idhabitacion,
            estado: 'Reservado',
            fechaIngreso: { $lt: fechaSalida },
            fechaSalida: { $gt: fechaIngreso }
        });

        const isAvailable = reservas.length === 0;
        res.json(isAvailable);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al verificar la disponibilidad');
    }
});

// Verificar disponibilidad
router.post('/reservas/verificarDisponibilidad', async (req, res) => {
    const { idhabitacion, fechaIngreso, fechaSalida } = req.body;
    try {
        const reservas = await Reserva.find({
            idhabitacion,
            $or: [
                { fechaIngreso: { $lte: new Date(fechaSalida) }, fechaSalida: { $gte: new Date(fechaIngreso) } }
            ]
        });

        if (reservas.length > 0) {
            res.json({ disponible: false });
        } else {
            res.json({ disponible: true });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Verificar si ya existe una reserva
router.post('/reservas/verificar-reserva-existente', async (req, res) => {
    const { idusuario, idhabitacion, fechaIngreso, fechaSalida } = req.body;
    try {
        const reservas = await Reserva.find({
            idusuario,
            idhabitacion,
            estado: 'Pendiente'
        });

        if (reservas.length > 0) {
            res.json({ existeReserva: true });
        } else {
            res.json({ existeReserva: false });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('reservas/update', async (req, res) => {
    const { userId, numTransaccion, facturacion, metodoPago } = req.body;
    Reserva.updateMany(
        { idusuario: userId, estado: 'Pendiente' },
        {
            $set: { estado: 'Reservado', numTransaccion, facturacion, metodoPago }
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

router.get('/reservass', async (req, res) => {
    try {
        const reservas = await Reserva.find().populate('idusuario').populate('idhabitacion');
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/reservasss', async (req, res) => {
    try {
        const reservas = await Reserva.find({estado: 'Reservado'}).populate('idusuario').populate('idhabitacion');
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
