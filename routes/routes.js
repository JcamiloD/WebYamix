const express = require('express');
const router = express.Router();
const { attachUserPermissions } = require('../controller/middleware/permisosVista');

router.use(attachUserPermissions);

router.get('/', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/index',{
        permisos: userPermissions
    });
});




router.get('/login', (req, res) => {
    res.render('web/login');
});



module.exports = router;