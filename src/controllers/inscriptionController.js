const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const conn = require("../database.js").promise();

exports.registerInscription = async (req, res, next) => {
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
        message: "Inicia sesion para Matricularte",
      });
    }

    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "ContraSecreta");

    const [row] = await conn.execute(
      "SELECT `nombre` FROM `courses` INNER JOIN `inscription` ON `nombre`=?",
      [req.body.nombre]
    );

    if (row.length > 0) {
      const [rowst] = await conn.execute(
        "SELECT `identificacion` FROM `students` INNER JOIN `inscription` ON `identificacion`=?",
        [req.body.identificacion]
      );
      if (rowst.length > 0) {
        const [rowin] = await conn.execute(
          "SELECT `s`.`identificacion`, `c`.`nombre` FROM `inscription` AS `i` INNER JOIN `students` AS `s` ON `i`.`id_student`=`s`.`id` INNER JOIN `courses` AS `c` ON `i`.`id_course`=`c`.`id` WHERE `s`.`identificacion`=? AND `c`.`nombre`=?",
           [req.body.identificacion, req.body.nombre]
        );
        if (rowin.length > 0) {
          return res.status(400).json({
            message: "Ya se encuentra matriculado el estudiante",
          });
        }

        const [rowx] = await conn.execute(
          "INSERT INTO `inscription` (`id_student`,`id_course`) SELECT `s`.`id`, `c`.`nombre` FROM `students` AS `s`, `courses` AS `c` WHERE `s`.`identificacion`=? AND `c`.`nombre`=?",
          [req.body.identificacion, req.body.nombre]
        );
    
        if (rowx.affectedRows === 1) {
            return res.status(201).json({
                message: "Materia matriculada",
          });
        }

      } else {
        return res.status(400).json({
          message: "El estudiante no se encuentra registrado",
        });
      }
    } else {
      return res.status(400).json({
        message: "La materia no esta registrada",
      });
    }

    /*const [rows] = await conn.execute(
      "INSERT INTO `courses` (`nombre`) VALUES (?)",
      [req.body.nombre]
    );

    if (rows.affectedRows === 1) {
        return res.status(201).json({
            message: "Materia registrada exitosamente",
        });
    }*/
  } catch (err) {
    next(err);
  }
};
