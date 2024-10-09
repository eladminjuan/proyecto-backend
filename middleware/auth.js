const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'tu_clave_secreta'); // Reemplaza 'tu_clave_secreta' por tu clave secreta
        const usuario = await Usuario.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!usuario) {
            throw new Error();
        }

        req.token = token;
        req.user = usuario;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Por favor, autentíquese.' });
    }
};

module.exports = auth;
