const { promisify } = require('util');


const FormData = require('form-data');
const axios = require('axios');



exports.actualizarCurso = async (req, res) => {
    const { id } = req.params;

    try {
        const formData = new FormData();
        
        // Agregar los campos recibidos
        formData.append('nombre_curso', req.body.nombre_curso || '');
        formData.append('descripcion', req.body.descripcion || '');
        formData.append('estado', req.body.estado || '');

        // Verificar y agregar el archivo
        if (req.file) {
            formData.append('file', req.file.buffer, req.file.originalname); // Asegúrate de manejar correctamente el archivo
        }

        // Enviar la solicitud al servidor principal
        const response = await axios.post(`http://localhost:4000/api/actualizar_curso/${id}`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Responder con éxito
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error al actualizar el curso:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || 'Error interno del servidor',
        });
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

exports.agregarCurso = async (req, res) => {
    try {
        // Acceder a los datos del curso y al archivo subido
        const { nombre_curso, descripcion, estado } = req.body;
        const file = req.file; // El archivo subido se encuentra aquí

        // Si no se subió archivo
        if (!file) {
            return res.status(400).json({ success: false, message: 'No se seleccionó una imagen' });
        }

        // Crear una instancia de FormData
        const formData = new FormData();
        formData.append('nombre_curso', nombre_curso);
        formData.append('descripcion', descripcion);
        formData.append('estado', estado);
        formData.append('file', file.buffer, { filename: file.originalname });

        // Realizar la solicitud POST con axios
        const response = await axios.post(`${process.env.pathApi}/agregar_curso`, formData, {
            headers: formData.getHeaders() // Establece los encabezados necesarios para el FormData
        });

        // Verificar la respuesta
        if (response.status === 200) {
            res.status(200).json({ success: true, message: 'Curso agregado exitosamente' });
        } else {
            console.error('Error al agregar curso:', response.data);
            res.status(response.status).json({ success: false, error: response.data.error || 'Error desconocido' });
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
