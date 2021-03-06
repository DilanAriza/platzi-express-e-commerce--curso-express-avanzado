const express = require('express');
const passport = require('passport');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const api = express.Router();

const { config } = require('../../config/');

//Basic strategie
require('../../utils/auth/strategies/basic');

function authApi(app) {
    const router = express.Router();

    app.use("/api/auth", router);

    router.post("/token", async function(req, res, next) {
        passport.authenticate("basic", function(error, user) {
            try {
                if (error || !user) {
                    next(Boom.unauthorized());
                }

                req.login(user, { session: false }, async function(error) {
                    if (error) {
                        next(error);
                    }

                    const payload = { sub: user.username, email: user.email };
                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: "15m"
                    });

                    return res.status(200).json({ access_token: token });
                });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    });
}

module.exports = authApi;