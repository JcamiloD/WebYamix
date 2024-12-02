const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');
const { attachUserPermissions } = require('../controller/middleware/permisosVista');
const asistencias = require('../controller/asistenciaController'); 

router.get('/historialAsistencia',verifyToken,restrictToPermiso('asistencia admin'), attachUserPermissions, asistencias.traerAsistencia, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./admin/historialAsistencia', { data: res.locals.data, permisos: userPermissions});
});

router.post('/crear_asistencia', asistencias.crearAsistencia)


module.exports = router;