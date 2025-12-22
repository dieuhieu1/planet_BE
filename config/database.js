module.exports = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "123456",
        database: process.env.DB_NAME || "planet_web_dev",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "postgres"
    },
    test: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "123456",
        database: process.env.DB_NAME || "planet_web_test",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "postgres"
    },
    production: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "123456",
        database: process.env.DB_NAME || "planet_web_prod",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "postgres"
    }
};
