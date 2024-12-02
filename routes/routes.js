const express = require('express');
const router = express.Router();
const { attachUserPermissions } = require('../controller/middleware/permisosVista');

const { verifyToken } = require('../controller/middleware/verificarToken');
const { restrictToPermiso } = require('../controller/middleware/redirect');

router.use(attachUserPermissions);

router.get('/', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/index',{
        permisos: userPermissions
    });
});



router.get('/about', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/about',{
        permisos: userPermissions
    });
});
router.get('/contac', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/contac',{
        permisos: userPermissions
    });
});
router.get('/clases', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/clases',{
        permisos: userPermissions
    });
});

router.get('/calen', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/calen',{
        permisos: userPermissions
    });
});

router.get('/perfil',verifyToken,restrictToPermiso('perfil'), attachUserPermissions,(req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/perfil',{
        permisos: userPermissions
    });
});



router.get('/login', (req, res) => {
    res.render('web/login');
});


router.get('/eventos', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/eventos',{
        permisos: userPermissions
    });
});
router.get('/catalogo', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('web/catalogo',{
        permisos: userPermissions
    });
});


module.exports = router;