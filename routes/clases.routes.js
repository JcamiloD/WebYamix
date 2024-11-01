const express = require('express');
const router = express.Router();
const clases = require('../controller/clasesController');

// Rutas de clases
router.post('/agregar_clase', clases.agregarClase);
router.put('/actualizar_clase/:id', clases.actualizarClase);
router.delete('/eliminar_clase/:id', clases.eliminarClase);
router.get('/traer_clases', clases.traerClases);
router.get('/obtener_clase/:id_clase', clases.obtenerClase);

// Ruta para el administrador de clases
router.get('/clasesAdmin', 
    clases.traerClases, 
    clases.obtenerProfesores, 
    clases.obtenerCursos, 
    (req, res) => {
        res.render('admin/clasesAdmin', { 
            data: res.locals.data,
            profesores: res.locals.profesores,
            cursos: res.locals.cursos
        });
    }
);

// Ruta para obtener todos los estudiantes
router.get('/todos_estudiantes',  clases.traerEstudiantes, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para obtener permisos por rol
router.get('/estudiantes_clases/:claseId',  clases.traerEstudiantesPorClase, (req, res) => {
    res.json(res.locals.data);
});

router.post('/actualizar_estudiantes', clases.actualizarEstudiantesPorClase);

module.exports = router;
