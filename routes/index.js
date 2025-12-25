const { notFound, errorHandler } = require("../middlewares/errorHandler");
const planetRouter = require("./planetRoutes");
const userRouter = require("./userRoutes");
const quizRouter = require("./quizRoutes");
const levelRouter = require('./levelRoutes');
const authRouter = require("./authRoutes");
const uploadRouter = require("./uploadRoutes");
const gasRouter = require("./gasRoutes");
const questionRouter = require("./questionRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');

const initRoutes = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use("/api/auth", authRouter);
    app.use("/api/planets", planetRouter);
    app.use("/api/users", userRouter);
    app.use("/api/quizzes", quizRouter);
    app.use("/api/levels", levelRouter);
    app.use("/api/questions", questionRouter);
    app.use("/api/upload", uploadRouter);
    app.use("/api/gases", gasRouter);

    // Middleware handle server error
    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;
