const express = require('express');
const router = express.Router();

const multer = require('multer');


const clases = require('../controller/clasesController');
const catalogoController = require('../controller/catalogoController.js');


const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });

router.get('/catalogoAdmin',catalogoController.getAll, clases.obtenerCursos, (req, res) => {
    res.render('admin/catalogoAdmin', {
        cursos: res.locals.cursos,
        catalogo: res.locals.catalogo
    });
});


router.post('/add', upload.single('imagen_producto'), catalogoController.addProduct);




router.post('/actualizarProducto',upload.single('imagen_producto'), catalogoController.actualizarProducto);

// En tu archivo de rutas
router.delete('/eliminarProducto/:id', catalogoController.eliminar);



module.exports = router;