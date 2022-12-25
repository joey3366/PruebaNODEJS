const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const conn = require("../database.js").promise();

exports.registerTeacher = async (req, res, next) => {
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
        message: "Inicia sesion para continuar",
      });
    }

    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "ContraSecreta");

    const [row] = await conn.execute(
        "SELECT `identificacion` FROM `teachers` WHERE `identificacion`=?",
        [req.body.identificacion]
      );

    if (row.length > 0) {
        return res.status(201).json({
            message: "El Profesor ya se encuentra registrado",
        });
    }

    const [rows] = await conn.execute(
      "INSERT INTO `teachers` (`identificacion`,`nombre`, `apellido`) VALUES (?,?,?)",
      [req.body.identificacion, req.body.nombre, req.body.apellido]
    );

    if (rows.affectedRows === 1) {
        return res.status(201).json({
            message: "Profesor registrado exitosamente",
      });
    }
  } catch (err) {
    next(err);
  }
};