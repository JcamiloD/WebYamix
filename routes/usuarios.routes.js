const express = require('express');
const router = express.Router();
const multer = require('multer');

const { verifyToken } = require('../controller/middleware/verificarToken');
const usuarios = require('../controller/usuarios_controller');

const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });

// Enrutador para manejar el formulario de carga
router.post('/add_documento', upload.array('nuevoDocumento[]'), usuarios.addDocument);

// Controlador traer estudiantes
router.get('/estudiantes', verifyToken, usuarios.traer, (req, res) => {
    res.render('./admin/estudiantes', { data: res.locals.data });
});


// Integrar middleware para verificar permisos y renderizar calendario
router.get('/calendarioUser', verifyToken, (req, res) => {
    // Comprobar el rol o permisos del usuario cargados en req.usuario
    const { rol } = req.usuario;

    if (rol === 'profesor') {
        res.render('calendarioProfe', { alert: false });
    } else {
        res.render('calendarioUser', { alert: false });
    }
});



// Controlador traer maestros
router.get('/profesores', verifyToken, usuarios.traer, (req, res) => {
    res.render('./admin/profesores', { data: res.locals.data });
});

// Renderizado del calendario para profesores
router.get('/calendarioProfe', (req, res) => {
    res.render('calendarioProfe', { alert: false });
});

// Controlador traer admin
router.get('/administradores', verifyToken, usuarios.traer, (req, res) => {
    res.render('./admin/administradores', { data: res.locals.data });
});
router.get('/usuariosEspera', verifyToken, usuarios.traerEspera, (req, res) => {
    res.render('./admin/soloEspera', { data: res.locals.data });
});



// Controladores usuarios
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuariosAdmin');
});

router.get('/usuariosAdmin', usuarios.traer, (req, res) => {
    res.render('./admin/usuariosAdmin', { data: res.locals.data });
});


// Ruta para mostrar el formulario de edición
router.get('/editar_usuario/:id', usuarios.obtenerUsuarioPorId, (req, res) => {
    res.render('./admin/editar_usuario', { usuario: res.locals.usuario });
});

router.post('/editar_usuario/:id', 
    (req, res, next) => {
        console.log('Solicitud POST recibida para editar usuario');
        console.log('ID del usuario:', req.params.id); // Log del ID del usuario
        console.log('Body de la solicitud:', req.body); // Log del cuerpo de la solicitud
        next();
    }, 
    usuarios.editarUsuario, 
    (req, res) => {
        console.log('Usuario editado, redirigiendo a la lista de usuarios');
        res.redirect('/usuariosAdmin'); // Redirige a la lista de usuarios después de editar
    }
);




router.delete('/eliminar/:id', usuarios.eliminarUsuario);

router.get('/inscripciones', usuarios.traer, (req, res) => {
    res.render('./admin/inscripciones', { data: res.locals.data });
});



module.exports = router;
