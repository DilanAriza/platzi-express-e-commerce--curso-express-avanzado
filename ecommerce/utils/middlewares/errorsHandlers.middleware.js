const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const Boom = require('@hapi/boom')

//Config
const { config } = require('../../config');

const isRequestAjaxOrApi = require('../singleUtils/isRequestAjaxOrApi')

//Sentry
Sentry.init({
    dsn: config.sentryAllUrl,
    tracesSampleRate: 1.0,
})
const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction'
})


//Functions
function withErrorStack(err, stack) {
    if (config.dev) {
        return {...err, stack }
    }
}

function logErrors(err, req, res, next) {
    Sentry.captureException(err);
    console.log(err.stack);
    transaction.finish()
    next(err);
}

function wrapErrors(err, req, res, next) {
    if (!err.isBoom) {
        next(Boom.badImplementation(err))
    }

    next(err);
}

function clientErrorHandler(err, req, res, next) {
    const {
        output: {
            statusCode,
            payload
        }
    } = err;

    //Catch errors for AJAX request or if an error ocurrs while streaming
    if (isRequestAjaxOrApi(req) || res.headersSent) {
        res.status(statusCode).json(withErrorStack(payload, err.stack))
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    const {
        output: { statusCode, payload }
    } = err;

    res.status(statusCode);
    res.render("error", withErrorStack(payload, err.stack))
}

module.exports = {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
}

/*
const Sentry = require("@sentry/node");

const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: "https://2805b87136a74acabec17e7cc4f30784@o576315.ingest.sentry.io/5729759",

  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);
*/