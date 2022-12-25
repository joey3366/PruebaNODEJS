const router = require('express').Router();
const {body} = require('express-validator');
const {register} = require('./controllers/registerController');
const {login} = require('./controllers/loginController');

router.post('/register', [
    body('nombre',"El nombre debe tener 2 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 2 }),
    body('apellido',"El apellido debe tener 2 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 2 }),
    body('email',"Correo invalido")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"La contraseña debe tener 3 caracteres como minimo").notEmpty().trim().isLength({ min: 3 }),
], register);


router.post('/login',[
    body('email',"Correo invalido")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"La contraseña debe tener 3 caracteres como minimo").notEmpty().trim().isLength({ min: 3 }),
],login);


module.exports = router;