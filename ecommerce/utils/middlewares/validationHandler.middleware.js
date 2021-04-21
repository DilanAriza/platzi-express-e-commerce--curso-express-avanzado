const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

function validate(data, schema) {
    const schemaValid = Joi.object(schema);
    const { error } = schemaValid.validate(data)
    return error;
}

function validationHandler(schema, check = "body") {
    return function(req, res, next) {
        const error = validate(req[check], schema)
        error ? next(Boom.badRequest(error)) : next();
    }
}

module.exports = validationHandler;