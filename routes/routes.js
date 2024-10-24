const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('web/index');
});




router.get('/login', (req, res) => {
    res.render('web/login');
});



module.exports = router;