const express = require('express');
const router = express.Router();

const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const { attachUserPermissions } = require('../controller/middleware/permisosVista');

const asistencias = require('../controller/asistenciaController'); 


router.use(attachUserPermissions);

router.get('/asistencia',verifyToken,restrictToPermiso('asistencia admin'),attachUserPermissions, asistencias.traerAsistencia, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/asistencia', { data: res.locals.data,  permisos: userPermissions });
});

router.post('/crear_asistencia',verifyToken, asistencias.crearAsistencia)

// Rutas de la asistencia del profe
router.get('/asistenciaProfe', asistencias.traerAsistenciaProfe, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    // Aquí se pasan los datos de asistencias y clases de res.locals a la vista
    res.render('web/asistenciaProfe', {
        permisos: userPermissions,
        dataAsistencias: res.locals.dataAsistencias,  // Asistencias obtenidas
        dataClases: res.locals.dataClases           // Clases obtenidas
    });
});



module.exports = router;