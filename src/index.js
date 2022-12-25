const express = require('express');
const teacherRoutes = require('./teacher.routes');
const routes = require('./routes');
const studentRoutes = require('./student.routes');
const courseRoutes = require('./course.routes');
const inscriptionRoutes = require('./inscription.routes');
const app = express();

app.use(express.json());

// RUTAS
app.use(routes);
app.use(studentRoutes);
app.use(teacherRoutes);
app.use(courseRoutes);
app.use(inscriptionRoutes);

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Error interno de servidor";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.listen(3000,() => console.log('Servidor en puerto 3000'));