
const { promisify } = require('util');


exports.obtenerCursos = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_cursos`); // Cambia la URL según tu API
        const cursos = await response.json();
        console.log(cursos)
        if (response.ok) {
            res.locals.cursos = cursos;
            next();
        } else {
            console.error('Error al traer cursos:', cursos);
            res.status(response.status).send(cursos.message || 'Error al obtener cursos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener cursos');
    }
};

// Método para obtener todos los profesores desde la API
exports.obtenerProfesores = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_profesores`); // Cambia la URL según tu API
        const profesores = await response.json();
        console.log(profesores)
        if (response.ok) {
            res.locals.profesores = profesores;
            next();
            
        } else {
            console.error('Error al traer profesores:', profesores);
            res.status(response.status).send(profesores.message || 'Error al obtener profesores');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener profesores');
    }
};
// Controlador para actualizar una clase
exports.actualizarClase = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:4000/api/actualizar_clase/${id}`, {
            method: 'PUT', // Cambia a 'PUT' si la API lo requiere
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al actualizar la clase:', errorData);
            return res.status(response.status).json({ error: errorData.error || 'Error al actualizar la clase' });
        }

        const result = await response.json();
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error al actualizar la clase:', error);
        res.status(500).send('Error interno del servidor');
    }
};



// Controlador para traer todas las clases y renderizar en la vista
exports.traerClases = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_clases`); // Cambia la URL según tu API
        const data = await response.json();
        console.log("hola "+data)

        if (response.ok) {
            res.locals.data = data;
            next();
        } else {
            console.error('Error al traer clases:', data);
            res.status(response.status).send(data.message || 'Error al traer las clases');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener las clases');
    }
};

// Controlador para agregar una nueva clase
exports.agregarClase = async (req, res) => {
    try {
        const { hora_inicio, hora_final, id_curso, id_usuario, estado } = req.body;

        const response = await fetch(`${process.env.pathApi}/agregar_clase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hora_inicio,
                hora_final,
                id_curso,
                id_usuario,
                estado
            })
        });

        if (response.ok) {
            res.json({ success: true, message: 'Clase agregada exitosamente' });
        } else {
            const result = await response.json();
            console.error('Error al agregar clase:', result);
            res.status(response.status).json({ success: false, error: result.error || 'Error desconocido' });
        }
    } catch (error) {
        console.error('Error al agregar clase:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Controlador para eliminar una clase
exports.eliminarClase = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/eliminar_clase/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            res.json({ success: true, message: 'Clase eliminada exitosamente' });
        } else {
            const errorResult = await response.json();
            console.error('Error al eliminar clase en la API:', errorResult);
            res.status(response.status).json({ success: false, error: errorResult.error || 'Error desconocido al eliminar la clase' });
        }
    } catch (error) {
        console.error('Error al eliminar la clase:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Controlador para obtener una clase específica por su ID
exports.obtenerClase = async (req, res) => {
    const { id_clase } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/obtener_clase/${id_clase}`);
        const result = await response.json();

        if (response.ok) {
            res.render('./dashboard/detalleClase', { clase: result }); // Cambia la vista según tus necesidades
        } else {
            console.error('Error al obtener clase:', result);
            res.status(404).json({ success: false, message: 'Clase no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener datos de la clase:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};
