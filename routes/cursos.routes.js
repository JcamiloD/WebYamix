
const express = require('express');
const router = express.Router();

const cursos = require('../controller/cursosController'); 

const multer = require('multer');

const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });




// Rutas para los cursos


router.post('/agregar_curso',upload.single('file'), cursos.agregarCurso);

router.put('/actualizar_curso/:id', cursos.actualizarCurso);
router.delete('/eliminar_curso/:id', cursos.eliminarCurso);
router.get('/obtener_curso/:id_curso', cursos.obtenerCurso);
router.get('/traer_cursos', cursos.traerCursos);

router.get('/cursosAdmin', cursos.traerCursos, (req, res) => {
    res.render('admin/cursosAdmin',  { data: res.locals.data});
});

module.exports = router;