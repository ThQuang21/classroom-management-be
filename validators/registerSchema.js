const joi = require("joi");
const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = new Error("Password must be strong. It must have at least one lowercase letter, one uppercase letter, one special character, and be at least 6 characters long.")

const RegisterSchema = joi.object({
    name: joi.string().required(),
    password: joi.string().regex(strongPasswordRegex).error(stringPassswordError).required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
});

module.exports = { RegisterSchema };
