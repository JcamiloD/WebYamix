const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { nombre, apellido, correo, contraseña, fecha_nacimiento } = req.body;
    console.log(req.body);
    try {
        // Registro del usuario a través de la API
        const userData = { nombre, apellido, correo, contraseña, fecha_nacimiento };
        const apiResponse = await fetch(`${process.env.pathApi}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const apiData = await apiResponse.json();

        if (apiResponse.ok) {
            // Si el registro es exitoso, redirige al login con alerta de éxito
            return res.render('web/inscripcion', {
                alert: 'Registro exitoso, ahora puedes iniciar sesión',
                ruta: 'login',
                alertType: 'success'
            });
        } else {
            // Si la API devuelve un error (correo ya en uso u otro error), muestra la alerta de error
            return res.render('web/inscripcion', {
                alert: apiData.message || 'Error al registrar el usuario',
                alertType: 'error',
                ruta: 'register'
            });
        }
    } catch (error) {
        // Si hay un error en el servidor, redirige a la página de registro con alerta
        return;
    }
};


exports.login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const loginData = { correo, contraseña };

        // Solicitud a la API
        const apiResponse = await fetch(`${process.env.pathApi}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        const responseData = await apiResponse.json();

        if (apiResponse.ok) {
            const { token } = responseData;

            // Configuración de la cookie
            const cookieOptions = {
                expires: new Date(
                    Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };
            res.cookie('jwt', token, cookieOptions);

            // Decodificar el token y determinar el rol
            const decodedToken = jwt.decode(token);
            const userRole = decodedToken.rol;

            let ruta = '';
            if (userRole === 'administrador') {
                ruta = '/dashboard';
            }

            // Responder al frontend con la ruta
            return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', ruta });
        } else {
            // Responder con un mensaje de error
            return res.status(apiResponse.status).json({
                mensaje: responseData.mensaje || 'Credenciales incorrectas'
            });
        }
    } catch (error) {
        console.error('Error en el proceso de login:', error);

        // Responder con un error genérico
        return res.status(500).json({
            mensaje: 'Error en el servidor. Intenta más tarde.'
        });
    }
};

exports.enviarCodigo = async (req, res) => {
    
    const { email } = req.body;
    console.log(email)

    try {
        const response = await fetch(`${process.env.pathApi}/enviar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            return res.status(200).json({
                mensaje: 'Código enviado correctamente.',
                ruta: '/codigo'
            });
        } else {
            return res.status(response.status).json({
                mensaje: data.mensaje || 'Error al enviar el código. Por favor, inténtalo de nuevo.'
            });
        }
    } catch (error) {
        console.error('Error al enviar el código de recuperación:', error);

        return res.status(500).json({
            mensaje: 'Error en el servidor. Inténtalo más tarde.'
        });
    }
};


exports.verificarCodigo = async (req, res) => {
    try {
        const { codigo, nuevaContraseña } = req.body;

        // Solicitud a la API externa
        const response = await fetch(`${process.env.pathApi}/verificarCodigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo, nuevaContraseña })
        });

        // Verificar si el contenido es JSON
        const contentType = response.headers.get('content-type');
        let result = {};

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            throw new Error('La respuesta de la API no es JSON.');
        }

        // Manejar respuesta de la API
        if (response.ok) {
            return res.status(200).json({
                mensaje: 'Cambio de contraseña exitoso.',
                ruta: '/login' // Redirección al login
            });
        } else {
            return res.status(response.status).json({
                mensaje: 'Código incorrecto.'
            });
        }
    } catch (error) {
        console.error('Error en la verificación del código:', error);

        // Respuesta en caso de error del servidor
        return res.status(500).json({
            mensaje: 'Hubo un problema con el servidor. Inténtalo más tarde.'
        });
    }
};




exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}