const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const { config } = require('../../config');


Sentry.init({
    dsn: config.sentryAllUrl,
    tracesSampleRate: 1.0,
})

const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction'
})

function logErrors(err, req, res, next) {
    Sentry.captureException(err);
    console.log(err.stack);
    transaction.finish()
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    //Catch errors for AJAX request
    if (req.xhr) {
        res.status(500).json({
            err: err.message
        })
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    //Catch errors with streaming
    if (req.headersSent) {
        next(err);
    }

    if (!config.dev) {
        delete err.stack;
    }

    res.status(err.status || 500);
    res.render("error", { error: err })
}

module.exports = {
    logErrors,
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