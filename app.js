const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');



const rutas = require('./routes/routes.js');
const auth = require('./routes/auth.routes.js')
const dashboard = require('./routes/dashboard.routes.js')
const usuariosAdmin = require('./routes/usuariosAdmin.routes.js')
const roles = require('./routes/roles.routes.js')

const app = express();

// Configura cookie-parser para manejar cookies
app.use(cookieParser());

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto si tu frontend está en otra URL
    credentials: true // Permite el envío de cookies
}));

// Configura el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configura la carpeta para archivos estáticos
app.use(express.static('public'));

// Configura el parseo de solicitudes URL-encoded y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Carga las variables de entorno
dotenv.config({ path: './env/.env' });


// Rutas


// Configura las rutas

app.use('/',rutas, auth,dashboard,usuariosAdmin, roles);



// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).send('Error interno del servidor');
});

// Inicia el servidor
app.listen(3000, () => {
    console.log('Server running in port http://localhost:3000/');
});
