const router = require('express').Router();
const { body } = require('express-validator');
const {registerCourse} = require('./controllers/courseController');

router.post('/registercourse', [
    body('nombre',"El nombre de la materia debe tener 2 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 2 })
], registerCourse);




module.exports = router;