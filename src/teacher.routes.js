const router = require('express').Router();
const { body } = require('express-validator');
const {registerTeacher} = require('./controllers/teacherController');

router.post('/registerteacher', [
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
], registerTeacher);




module.exports = router;