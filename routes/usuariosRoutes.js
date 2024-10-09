const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer();
const auth = require('../middleware/auth');


// Crear un nuevo usuario
router.post('/usuarios', upload.single('foto'), async (req, res) => {
    const { nombre, correo, password, roles, telefono, tipdocu, numdocu, pais, estado, fecha } = req.body;
    const foto = req.file ? req.file.buffer : null;
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const usuario = new Usuario({ nombre, correo, password: hashedPassword, roles, foto, telefono, tipdocu, numdocu, pais, estado, fecha });
        await usuario.save();
        res.status(201).send(usuario);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find().lean();
        usuarios.forEach(usuario => {
            if (usuario.foto) {
                usuario.foto = usuario.foto.toString('base64');
            }
        });
        res.json(usuarios);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Endpoint para obtener la cantidad de usuarios sin roles
router.get('/usuarios/sin-roles/count', async (req, res) => {
    try {
        const count = await Usuario.countDocuments({ roles: { $size: 0 } });
        res.status(200).json(count);
    } catch (err) {
        res.status(500).send('Error al obtener la cantidad de usuarios sin roles');
    }
});

// Actualizar un usuario por ID
router.put('/usuarios/:id', upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, roles, telefono, tipdocu, numdocu, pais, estado } = req.body;
    const foto = req.file ? req.file.buffer : null;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }
        usuario.nombre = nombre;
        usuario.correo = correo;
        usuario.roles = roles ? roles : [];
        if (foto) usuario.foto = foto;
        usuario.telefono = telefono;
        usuario.tipdocu = tipdocu;
        usuario.numdocu = numdocu;
        usuario.pais = pais;
        usuario.estado = estado;
        await usuario.save();
        res.status(200).send(usuario);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Eliminar un usuario por ID
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByIdAndDelete(id);
        if (!usuario) {
            return res.status(404).json('Usuario no encontrado');
        }
        res.status(200).json('Usuario eliminado');
    } catch (err) {
        res.status(500).json(err);
    }
});

// Ruta para cambiar la contraseña
router.put('/usuarios/:id/change-password', async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña antigua
        const isMatch = await bcrypt.compare(oldPassword, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña antigua incorrecta' });
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(newPassword, salt);

        // Guardar el usuario actualizado
        await usuario.save();
        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
});

module.exports = router;
