const router = require('express').Router();
const { body } = require('express-validator');
const {registerInscription} = require('./controllers/inscriptionController');

router.post('/inscription', [
    body('identificacion',"la identificacion debe tener 4 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim().isLength({ min: 4}),
    body('nombre',"El nombre de la materia debe tener 2 caracteres como minimo")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 2 })
], registerInscription);

module.exports = router;