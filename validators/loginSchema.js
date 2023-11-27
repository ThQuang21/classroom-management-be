const joi = require("joi");

const LoginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

module.exports = { LoginSchema };
