const express = require('express');
const router = express.Router();

const { verifyToken } = require('../controller/middleware/verificarToken');
const asistencias = require('../controller/asistenciaController'); 

router.get('/historialAsistencia', asistencias.traerAsistencia, (req, res) => {
    res.render('./admin/historialAsistencia', { data: res.locals.data });
});

router.post('/crear_asistencia', asistencias.crearAsistencia)


module.exports = router;