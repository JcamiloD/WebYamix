const express = require('express');
const router = express.Router();

router.get('/usuariosAdmin', (req, res) => {
    res.render('admin/usuariosAdmin');
});


module.exports = router;