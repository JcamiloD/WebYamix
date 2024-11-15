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
    console.log(req.body);

    try {


        const loginData = { correo, contraseña };
        const apiResponse = await fetch(`${process.env.pathApi}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        const responseData = await apiResponse.json();
        console.log('Respuesta de la API:', responseData);

        if (apiResponse.ok) {
            const { token } = responseData;
            const cookieOptions = {
                expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('jwt', token, cookieOptions);

            const decodedToken = jwt.decode(token);
            const userRole = decodedToken.rol;

            let ruta = '';
            if (userRole === 'administrador') {
                ruta = 'dashboard';
            }

            return res.render('web/login', {
                alert: 'Login correcto',
                alertType: 'success',
                ruta: ruta
            });
        } else {
            return res.render('web/login', {
                alert: responseData.message || 'Credenciales incorrectas, intenta nuevamente',
                alertType: 'error',
                ruta: 'login'
            });
        }
    } catch (error) {
        console.log('Error en el proceso de login:', error);
        return res.status(500).render('web/login', {
            alert: 'Error en el servidor, intenta más tarde',
            alertType: 'error',
            ruta: 'login'
        });
    }
};


exports.enviarCodigo = async (req, res, next) => {
    const { email } = req.body;
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
            res.render('web/codigo', { alert: { type: 'success', message: 'Código enviado correctamente.',ruta: '/codigo'  } });
        } else {
            res.render('web/recuperar', { alert: { type: 'error', message: 'Error al enviar el código. Por favor, inténtalo de nuevo.', ruta: '/recuperar'  } });
        }
    } catch (error) {
        console.error('Error al enviar el código de recuperación:', error);
        res.render('recuperar', { alert: { type: 'error', message: 'Error al enviar el código de recuperación. Inténtalo más tarde.' } });
    }
};



exports.verificarCodigo = async (req, res, next) => {
    try {
        const { codigo, nuevaContraseña } = req.body;

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
            throw new Error('Respuesta no es JSON');
        }

        if (response.ok) {
            res.render('web/login', { 
                alertType: 'success', 
                alert: 'Cambio de contraseña exitoso.', 
                ruta: 'login' 
            });
        } else {
            res.render('web/codigo', { 
                alertType: 'error', 
                alert: 'Código incorrecto.', 
                ruta: 'codigo'
            });
        }
        
    } catch (error) {
        console.error('Error en la verificación del código:', error);
        res.status(500).json({ message: 'Error en la verificación del código.' });
    }
};




exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}