const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { nombre, apellido, correo, contraseña, fecha_nacimiento } = req.body;
    console.log(req.body);
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    try {
        // Validaciones de los campos
        if (!nombre || !apellido || !contraseña || !fecha_nacimiento) {
            return res.render('web/inscripcion', { alert: 'Por favor completa todos los campos', alertType: 'error', ruta: 'register' });
        }

        if (!correo.includes('@')) {
            return res.render('web/inscripcion', { alert: 'Correo inválido', alertType: 'error', ruta: 'register' });
        }

        if (!passwordRegex.test(contraseña)) {
            return res.render('web/inscripcion', {
                alert: 'La contraseña debe tener al menos 6 caracteres, incluyendo letras min y mayus , números y caracteres especiales.',
                alertType: 'error',
                ruta: 'register'
            });
        }

        // Cálculo de la edad
        const today = new Date();
        const birthDate = new Date(fecha_nacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

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
        return res.render('web/inscripcion', { alert: 'Ocurrió un error en el servidor', alertType: 'error', ruta: 'register' });
    }
};


exports.login = async (req, res) => {
    const { correo, contraseña } = req.body;
    console.log(req.body);

    try {
        if (!correo || !contraseña) {
            return res.render('web/login', {
                alert: 'Por favor ingresa todos los datos',
                alertType: 'error',
                ruta: 'login'
            });
        }

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





exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}