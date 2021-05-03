const { expect } = require('chai');

const errorsHandlersMiddlewares = require('../../utils/middlewares/errorsHandlers.middleware');

const {
    withErrorStack,
    logErrors,
    wrapErrors,
    clientErrorHandler
} = errorsHandlersMiddlewares;

describe('Middlewares - Errors Handlers', () => {
    describe('when withErrorStack method is called', () => {
        withErrorStackObjectRequest = {
            err: () => { return { message: 'Error message: message' } },
            stack: 'The error stack'
        };

        it('should return error Object', () => {
            const result = withErrorStack(withErrorStackObjectRequest.err(), withErrorStackObjectRequest.stack);
            expect(result).to.be.an('object');
        });

        it('should return error message string', () => {
            const result = withErrorStack(withErrorStackObjectRequest.err(), withErrorStackObjectRequest.stack);
            expect(result.message).to.be.an('string');
        });

        it('should return error stack string', () => {
            const result = withErrorStack(withErrorStackObjectRequest.err(), withErrorStackObjectRequest.stack);
            expect(result.stack).to.be.an('string');
        });
    });

    describe('when logErros method is called', () => {

        let errNextLogErrors;

        logErrorsObjectRequest = {
            err: {
                stack: 'The error stack'
            },
            req: {},
            res: {},
            next: (err) => {
                errNextLogErrors = err;
            },
        };

        it('should return next with object Error stack', () => {
            logErrors(logErrorsObjectRequest.err, logErrorsObjectRequest.req, logErrorsObjectRequest.res, logErrorsObjectRequest.next)
            expect(errNextLogErrors).to.be.an('object');
        });

        it('should return next with errorStack in string typeof', () => {
            logErrors(logErrorsObjectRequest.err, logErrorsObjectRequest.req, logErrorsObjectRequest.res, logErrorsObjectRequest.next)
            expect(errNextLogErrors.stack).to.be.an('string');
        });
    });

    describe('when wrapErrors method is called', () => {

        let errNextWrapErrors;

        let wrapErrorsObjectRequest = {
            err: {
                stack: 'The error stack',
                isBoom: false
            },
            req: {},
            res: {},
            next: (errorReturn) => {
                errNextWrapErrors = errorReturn;
            },
        };

        it('should return next function with error message equal badImplementation and Status code 500', () => {
            wrapErrors(wrapErrorsObjectRequest.err, wrapErrorsObjectRequest.req, wrapErrorsObjectRequest.res, wrapErrorsObjectRequest.next)
            expect(errNextWrapErrors.output.statusCode).to.be.equal(500);
        });

        it('should return next function with error message equal badImplementation and isBoom equal true', () => {
            wrapErrors(wrapErrorsObjectRequest.err, wrapErrorsObjectRequest.req, wrapErrorsObjectRequest.res, wrapErrorsObjectRequest.next)
            expect(errNextWrapErrors.isBoom).to.be.equal(true);
        });

        it('should return next function with errorStack object ', () => {
            wrapErrorsObjectRequest.err.isBoom = true;
            wrapErrors(wrapErrorsObjectRequest.err, wrapErrorsObjectRequest.req, wrapErrorsObjectRequest.res, wrapErrorsObjectRequest.next)
            expect(errNextWrapErrors).to.be.an('object');
        });

        it('should return next function with errorStack in string typeof', () => {
            wrapErrorsObjectRequest.err.isBoom = true;
            wrapErrors(wrapErrorsObjectRequest.err, wrapErrorsObjectRequest.req, wrapErrorsObjectRequest.res, wrapErrorsObjectRequest.next)
            expect(errNextWrapErrors.stack).to.be.an('string');
        });
    });

    describe('when clientErrorHandler method is called', () => {
        let errNextCER;
        let responseCER;

        class ResponseClass {
            constructor() {
                this.statusCode;
                this.data;
                this.json;
            }

            status(status) {
                return {
                    json: (data) => {
                        responseCER = {
                            stack: data.stack,
                            status: status
                        }
                    }
                }
            }
        };

        let CERObjectRequest = {
            err: {
                stack: 'The error stack',
                isBoom: true,
                output: {
                    statusCode: 500,
                    payload: 'Error Payload message'
                }
            },
            req: {
                accepts: () => true,
                xhr: false
            },
            // res: new ResponseClass(),
            res: new ResponseClass(),
            next: (errorReturn) => {
                errNextCER = errorReturn;
            },
        };

        //False

        it('should return next function with status code equal 500', () => {
            clientErrorHandler(CERObjectRequest.err, CERObjectRequest.req, CERObjectRequest.res, CERObjectRequest.next)
            expect(errNextCER.output.statusCode).to.be.equal(500);
        });

        it('should return err function with stack in string typeof', () => {
            clientErrorHandler(CERObjectRequest.err, CERObjectRequest.req, CERObjectRequest.res, CERObjectRequest.next)
            expect(errNextCER.stack).to.be.an('string');
        });

        // // True
        it('should return next function with errorStack object ', () => {
            CERObjectRequest.req.accepts = () => true;
            CERObjectRequest.req.xhr = true;

            clientErrorHandler(CERObjectRequest.err, CERObjectRequest.req, CERObjectRequest.res, CERObjectRequest.next)
            expect(responseCER).to.be.an('object');

        });

        it('should return next function with errorStack in string typeof', () => {
            clientErrorHandler(CERObjectRequest.err, CERObjectRequest.req, CERObjectRequest.res, CERObjectRequest.next)
            expect(responseCER.stack).to.be.an('string');
        });
    });

    describe('when errorHandler method is called', () => {
        let errNextEH;
        let responseEH;

        class ResponseClass {
            constructor() {
                this.statusCode;
                this.data;
                this.json;
            }

            status(status) {
                responseEH = {
                    status: status
                };
                return {
                    json: (data) => {
                        responseEH = {
                            status: status,
                            stack: data.stack
                        }
                    }
                }
            }
        };

        let EHObjectRequest = {
            err: {
                stack: 'The error stack',
                isBoom: true,
                output: {
                    statusCode: 500,
                    payload: 'Error Payload message'
                }
            },
            req: {
                accepts: () => false,
                xhr: false
            },
            res: new ResponseClass(),
            next: (errorReturn) => {
                errNextEH = errorReturn;
            },
        };

        it('should return res function with status code equal 500', () => {
            clientErrorHandler(EHObjectRequest.err, EHObjectRequest.req, EHObjectRequest.res, EHObjectRequest.next)
            expect(responseEH.status).to.be.equal(500);
        });

        it('should return res function with stack in string typeof', () => {
            wrapErrors(EHObjectRequest.err, EHObjectRequest.req, EHObjectRequest.res, EHObjectRequest.next)
            expect(responseEH.stack).to.be.an('string');
        });
    });
});