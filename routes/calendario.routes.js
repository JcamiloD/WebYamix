const express = require('express');
const eventos = require('../controller/calendarioController'); 

const router = express.Router();

// Rutas para manejar eventos
router.get('/traer_eventos', eventos.traerEventos);
router.get('/obtener_evento/:id', eventos.obtenerEventoPorId); 
router.post('/agregar_evento', eventos.agregarEvento);
router.post('/actualizar_evento/:id', eventos.actualizarEvento);
router.delete('/eliminar_evento/:id', eventos.eliminarEvento);
router.get('/traerEventosPorNombreClase/:nombre_clase', eventos.traerEventosPorNombreCurso); 


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
    eventos.traerEventos,
    (req, res) => {
        res.render('admin/modalUpdateEvento', { 
            cursos: res.locals.cursoss,  // Acceder a los cursos
            eventos: res.locals.eventos  // Acceder a los eventos
        });
    }
);



router.get('/cargar_evento/:id', eventos.cargarEventoParaActualizar);
  
module.exports = router;
