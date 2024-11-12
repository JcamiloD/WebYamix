const { promisify } = require('util');

// Controlador para traer las asistencias y clases y renderizar en la vista
exports.traerAsistencia = async (req, res, next) => {
    try {
        // Realizamos la petición a la API para obtener las asistencias
        const responseAsistencias = await fetch(`${process.env.pathApi}/traer_asistencia`);
        const dataAsistencias = await responseAsistencias.json();

        // Realizamos la petición a la API para obtener las clases
        const responseClases = await fetch(`${process.env.pathApi}/traer_clases`);
        const dataClases = await responseClases.json();

        // Verificamos que ambas peticiones fueron exitosas
        if (responseAsistencias.ok && responseClases.ok) {
            // Pasamos los datos de las asistencias y las clases a res.locals
            res.locals.dataAsistencias = dataAsistencias;
            res.locals.dataClases = dataClases;

            next(); // Continuamos con el siguiente middleware o controlador
        } else {
            console.error('Error al traer asistencias o clases:', dataAsistencias, dataClases);
            res.status(responseAsistencias.status).send(dataAsistencias.message || 'Error al traer las asistencias o clases');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener las asistencias o clases');
    }
};


// Controlador para crear la asistencia
exports.crearAsistencia = async (req, res) => {
    try {
        const { id_clase, fecha_asistencia, estudiantes } = req.body;
        console.log(req.body)
        
        // Validar los datos antes de enviarlos
        if (!id_clase || !fecha_asistencia || !Array.isArray(estudiantes) || estudiantes.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos.' });
        }

        // Enviar los datos al endpoint de creación de asistencia
        const response = await fetch(`${process.env.pathApi}/crear_asistencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_clase, fecha_asistencia, estudiantes })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirigir a la vista con un mensaje de éxito
            res.json({ message: 'Asistencia registrada con éxito' }); // Respondemos con un mensaje de éxito
        } else {
            // Renderizar una vista de error o mostrar el mensaje de error
            res.status(response.status).json({ message: data.message || 'Error al crear la asistencia en la API' });
        }
    } catch (error) {
        console.error('Error al crear la asistencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};