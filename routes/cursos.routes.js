const express = require('express');
const router = express.Router();

router.get('/cursosAdmin', (req, res) => {
    res.render('admin/cursosAdmin');
});

module.exports = router;