const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Traer usuarios desde la API
exports.traer = async (req, res, next) => {
    try {
        // Traer usuarios
        const responseUsuarios = await fetch(`${process.env.pathApi}/traer_usuarios`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!responseUsuarios.ok) throw new Error(`Error en la API de usuarios: ${responseUsuarios.statusText}`);
        const dataUsuarios = await responseUsuarios.json();
        
        // Traer roles
        const responseRoles = await fetch(`${process.env.pathApi}/traer_roles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!responseRoles.ok) throw new Error(`Error en la API de roles: ${responseRoles.statusText}`);
        const dataRoles = await responseRoles.json();
        
        // Almacenar los datos en res.locals
        res.locals.data = dataUsuarios; // Usuarios
        res.locals.roles = dataRoles;    // Roles

        next();
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error interno del servidor');
    }
};



// Traer usuarios en estado de espera desde la API
exports.traerEspera = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/usuariosEspera`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener usuarios en espera:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Agregar usuario
exports.agregarUsuario = async (req, res, next) => {
    try {
        const usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            fecha_nacimiento: req.body.fecha_nacimiento,
            correo: req.body.correo, // Asegúrate de que sea 'correo'
            contraseña: req.body.contrasena, // Asegúrate de que sea 'contrasena'
            id_rol: req.body.id_rol,
            estado: req.body.estado,
            documentacion: req.body.documentacion === 'true', // Convertir a booleano si es cadena
            pagos: req.body.fecha_pagado || null // Enviar la fecha si existe, si no, null
        };

        console.log('Datos del usuario:', usuario); // Verificar datos enviados

        const response = await fetch(`${process.env.pathApi}/agregar_usuario`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la API:', errorData);
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};




// Obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const response = await fetch(`${process.env.pathApi}/obtener_usuario/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        const data = await response.json();
        res.locals.usuario = data;
        next();
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Editar usuario
exports.editarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/editar_usuario/${id}`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        res.redirect('/usuariosAdmin'); // Asegúrate de que la redirección sea adecuada
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ error: 'Error al editar el usuario' });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await fetch(`${process.env.pathApi}/eliminar_usuario/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
