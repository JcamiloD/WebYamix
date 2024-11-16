const express = require('express');
const eventos = require('../controller/calendarioController'); // Verifica que la ruta sea correcta

const router = express.Router();

// Rutas para manejar eventos
router.get('/traer_eventos', eventos.traerEventos);
router.get('/obtener_evento/:id', eventos.obtenerEventoPorId); // Cambia a obtenerEventoPorId
router.post('/agregar_evento', eventos.agregarEvento);
router.post('/actualizar_evento/:id', eventos.actualizarEvento);
router.delete('/eliminar_evento/:id', eventos.eliminarEvento);
router.get('/traerEventosPorNombreClase/:nombre_clase', eventos.traerEventosPorNombreCurso); 

// ruta para el calendarioAdmin
router.get('/calendarioAdmin', 
    eventos.obtenerCursoss, 
    (req, res) => {

        res.render('admin/calendarioAdmin', { 
            cursos: res.locals.cursoss 
        });
    }
);
    router.get('/modalUpdateEvento', 
        eventos.obtenerCursoss, 
        (req, res) => {
        
            res.render('admin/modalUpdateEvento', { 
                cursos: res.locals.cursoss 
            });
        }
    );


router.get('/cargar_evento/:id', eventos.cargarEventoParaActualizar);
  
module.exports = router;
