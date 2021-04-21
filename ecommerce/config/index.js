require("dotenv").config(); //Esta linea coje todas las variables del .env y las pasa al entorno

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    sentryAllUrl: process.env.SENTRY_URL,
    sentryDNS: process.env.SENTRY_DNS,
    sentryID: process.env.SENTRY_ID,
};

module.exports = { config };