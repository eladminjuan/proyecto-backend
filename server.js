const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const habitacionRoutes = require('./routes/habitacionRoutes');
const usuarioRoutes = require('./routes/usuariosRoutes');
const loginRoutes = require('./routes/login');
const reserva = require('./routes/reserva');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Configuración de multer para manejar archivos de imagen
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conectar a MongoDB
const uri = 'mongodb+srv://jdgom:Londoneye091031GambinoCtrlJ@cluster0.7mdi4je.mongodb.net/';
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Rutas
app.use('/api', habitacionRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', loginRoutes);
app.use('/api', reserva);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
