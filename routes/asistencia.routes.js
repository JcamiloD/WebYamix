const express = require('express');
const router = express.Router();

const { verifyToken } = require('../controller/middleware/verificarToken');

router.get('/asistencia', (req, res) => {
    res.render('./admin/asistencia', { data: res.locals.data });
});


module.exports = router;