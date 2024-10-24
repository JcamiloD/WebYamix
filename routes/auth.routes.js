const express = require('express');
const router = express.Router();
const auth = require('../controller/authController')


router.get('/register', (req, res) => {
    res.render('web/inscripcion');
});


router.post('/registro', auth.register);
router.post('/logueo', auth.login);


module.exports = router;