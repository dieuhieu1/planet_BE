const { notFound, errorHandler } = require("../middlewares/errorHandler");
const planetRouter = require("./planetRoutes");
const userRouter = require("./userRoutes");
const quizRouter = require("./quizRoutes");
const authRouter = require("./authRoutes");

const initRoutes = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/planets", planetRouter);
    app.use("/api/users", userRouter);
    app.use("/api/quizzes", quizRouter);

    // Middleware handle server error
    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;
