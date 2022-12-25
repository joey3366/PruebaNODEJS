const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const conn = require("../database.js").promise();

exports.registerCourse = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer") ||
      !req.headers.authorization.split(" ")[1]
    ) {
      return res.status(422).json({
        message: "Inicia sesion para registrar materias",
      });
    }

    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "ContraSecreta");

    const [row] = await conn.execute(
        "SELECT `nombre` FROM `courses` WHERE `nombre`=?",
        [req.body.nombre]
      );

    if (row.length > 0) {
        return res.status(201).json({
            message: "La materia ya esta registrada",
        });
    }

    const [rows] = await conn.execute(
      "INSERT INTO `courses` (`nombre`) VALUES (?)",
      [req.body.nombre]
    );

    if (rows.affectedRows === 1) {
        return res.status(201).json({
            message: "Materia registrada exitosamente",
        });
    }
  } catch (err) {
    next(err);
  }
};