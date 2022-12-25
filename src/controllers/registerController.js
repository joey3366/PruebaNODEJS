const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../database').promise();

exports.register = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
        );

        if (row.length > 0) {
            return res.status(201).json({
                message: "El correo ya esa en uso",
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await conn.execute('INSERT INTO `users`(`nombre`,`apellido`,`email`,`password`) VALUES(?,?,?,?)',[
            req.body.nombre,
            req.body.apellido,
            req.body.email,
            hashPass
        ]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Usuario registrado exitosamente",
            });
        }
        
    }catch(err){
        next(err);
    }
}