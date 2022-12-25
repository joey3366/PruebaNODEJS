const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const conn = require("../database.js").promise();

exports.registerStudent = async (req, res, next) => {
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
        message: "Escribe tu token",
      });
    }

    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "ContraSecreta");

    const [row] = await conn.execute(
        "SELECT `identificacion` FROM `students` WHERE `identificacion`=?",
        [req.body.identificacion]
      );

    if (row.length > 0) {
        return res.status(201).json({
            message: "El estudiante ya se encuentra registrado",
        });
    }

    const [rows] = await conn.execute(
      "INSERT INTO `students` (`identificacion`,`nombre`, `apellido`) VALUES (?,?,?)",
      [req.body.identificacion, req.body.nombre, req.body.apellido]
    );

    if (rows.affectedRows === 1) {
        return res.status(201).json({
            message: "Estudiante registrado exitosamente",
        });
    }
  } catch (err) {
    next(err);
  }
};
