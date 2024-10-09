const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); // Asegúrate de que la ruta es correcta

const router = express.Router();

// Endpoint de login
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(400).send('Contraseña incorrecta');
        }

        const rolesPermitidos = ['Auxiliar', 'Administrador'];
        const tieneRolPermitido = usuario.roles.some(role => rolesPermitidos.includes(role));

        if (!tieneRolPermitido) {
            return res.status(403).send('Acceso denegado');
        }

        let fotoBase64 = null;
        if (usuario.foto) {
            fotoBase64 = usuario.foto.toString('base64');
        }

        // Generar JWT
        const token = jwt.sign({ id: usuario._id, roles: usuario.roles }, 'secretKey', { expiresIn: '1h' });

        res.status(200).send({
            token, usuario: {
                ...usuario.toObject(),
                foto: fotoBase64
            }
        });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

router.post('/loginC', async (req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(400).send('Contraseña incorrecta');
        }

        let fotoBase64 = null;
        if (usuario.foto) {
            fotoBase64 = usuario.foto.toString('base64');
        }

        // Generar JWT
        const token = jwt.sign({ id: usuario._id }, 'secretKey', { expiresIn: '1h' });

        res.status(200).send({
            token, usuario: {
                ...usuario.toObject(),
                foto: fotoBase64
            }
        });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
