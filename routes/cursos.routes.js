
const express = require('express');
const router = express.Router();

const cursos = require('../controller/cursosController'); 

// Rutas para los cursos


router.post('/agregar_curso', cursos.agregarCurso);
router.put('/actualizar_curso/:id', cursos.actualizarCurso);
router.delete('/eliminar_curso/:id', cursos.eliminarCurso);
router.get('/obtener_curso/:id_curso', cursos.obtenerCurso);
router.get('/traer_cursos', cursos.traerCursos);

module.exports = router;


module.exports = router;

router.get('/cursosAdmin', cursos.traerCursos, (req, res) => {
    res.render('admin/cursosAdmin',  { data: res.locals.data});
});

module.exports = router;