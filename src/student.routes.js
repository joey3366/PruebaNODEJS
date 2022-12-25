const router = require('express').Router();
const { body } = require('express-validator');
const {registerStudent} = require('./controllers/studentController');

router.post('/registerstudent', [
    body('identificacion',"la identificacion debe tener 4 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim().isLength({ min: 4}),
    body('nombre',"El nombre debe tener 2 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 2 }),
    body('apellido',"El apellido debe tener 2 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 2 })
], registerStudent);




module.exports = router;