const { promisify } = require('util');



// Controlador para actualizar un curso
exports.actualizarCurso = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:4000/api/actualizar_curso/${id}`, {
            method: 'POST', // Cambiar a 'PUT' si la API lo requiere
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al actualizar el curso:', errorData);
            return res.status(response.status).json({ error: errorData.error || 'Error al actualizar el curso' });
        }

        const result = await response.json();
        res.json({ success: true, data: result });        
    } catch (error) {
        console.error('Error al actualizar el curso:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Controlador para traer todos los cursos y renderizar en la vista
exports.traerCursos = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_cursos`);
        const data = await response.json();

        if (response.ok) {
            res.locals.data = data;
            next();
        } else {
            console.error('Error al traer cursos:', data);
            res.status(response.status).send(data.message || 'Error al traer los cursos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener los cursos');
    }
};

// Controlador para agregar un nuevo curso
exports.agregarCurso = async (req, res) => {
    try {
        const { nombre_curso, descripcion, estado } = req.body;

        const response = await fetch(`${process.env.pathApi}/agregar_curso`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_curso,
                descripcion,
                estado
            })
        });

        if (response.ok) {
            res.json({ success: true, message: 'Curso agregado exitosamente' });
        } else {
            const result = await response.json();
            console.error('Error al agregar curso:', result);
            res.status(response.status).json({ success: false, error: result.error || 'Error desconocido' });
        }
    } catch (error) {
        console.error('Error al agregar curso:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};



// Controlador para eliminar un curso
exports.eliminarCurso = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/eliminar_curso/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            res.json({ success: true, message: 'Curso eliminado exitosamente' });
        } else {
            const errorResult = await response.json();
            console.error('Error al eliminar curso en la API:', errorResult);
            res.status(response.status).json({ success: false, error: errorResult.error || 'Error desconocido al eliminar el curso' });
        }
    } catch (error) {
        console.error('Error al eliminar el curso:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Controlador para obtener un curso específico por su ID
exports.obtenerCurso = async (req, res) => {
    const { id_curso } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/obtener_curso/${id_curso}`);
        const result = await response.json();

        if (response.ok) {
            res.render('./dashboard/detalleCurso', { curso: result });
        } else {
            console.error('Error al obtener curso:', result);
            res.status(404).json({ success: false, message: 'Curso no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener datos del curso:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
