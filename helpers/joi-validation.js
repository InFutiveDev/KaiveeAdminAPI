const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

/**
 * validating options for Joi
 */
const options = {
    abortEarly: false,
};

const email = (value, helpers) => {
    const domain = value.split('@');
    if (domain[1] === `yopmail.com`) {
        return helpers.error('any.invalid');
    }
    return value;
};

const passwordSchema = Joi.string()
    .empty()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        name: 'required',
    })
    .message(
        `Enter a password with minimum one upper case, lower case and number, ranging from 8-15 characters`,
    )
    .min(8)
    .max(15)
    .messages({
        'string.base': `Enter a password with minimum one upper case, lower case and number, ranging from 8-15 characters`,
        'string.empty': `Password is required`,
        'string.min': `Password must have a minimum of {#limit} characters`,
        'string.max': `Password can have a maximum of {#limit} characters`,
        'any.required': `Password is required`,
    });
const nameSchema = Joi.string()
    .empty()
    .max(150)
    .messages({
        'string.base': `Name must be a type of string`,
        'string.empty': `Name is required `,
        'string.max': `Name can have maximum  of {#limit} characters`,
        'any.required': `Name is required `,
        'any.optional': `Name is optional `,
    });

const emailSchema = Joi.string()
    .empty()
    .custom(email, 'custom validation')
    .message('Invalid Email')
    .email({ tlds: { allow: true } })
    .max(256)
    .required()
    .messages({
        'string.base': `Enter your email address in format: yourname@example.com`,
        'string.email': `Enter your email address in format: yourname@example.com`,

        'string.empty': `Email is required`,
        'string.min': `Email must have minimum of {#limit} characters`,
        'string.max': `Email can have maximum of {#limit} characters`,
        'any.required': `Email is required`,
        'any.invalid': `Invalid Email`,
    });

const emailPasswordSchema = Joi.object()
    .keys({
        name: nameSchema.required(),
        email: emailSchema,
        password: passwordSchema,
    })
    .unknown(true);

const emailVerifySchema = Joi.object().keys({
    code: Joi.string().empty().messages({
        'string.base': `code must be a type of string`,
        'string.empty': `code is required`,
        'string.min': `code must have minimum of {#limit} characters`,
        'string.max': `code can have maximum  of {#limit} characters`,
        'any.required': `code is required`,
        'any.optional': `code is optional`,
    }),
});

const emailVerify = Joi.object().keys({
    email: emailSchema,
});
const secondaryEmailVerify = Joi.object().keys({
    secondaryEmail: emailSchema,
});



const loginSchema = Joi.object()
    .keys({
        email: emailSchema,
        // password: passwordSchema,
    })
    .unknown(true);


// Function




const registerWithEmailAndPassword = (data) => {
    return emailPasswordSchema.validate(data, options);
};
const tokenVerification = (data) => {
    return emailVerifySchema.validate(data, options);
};
const emailVerification = (data) => {
    return emailVerify.validate(data, options);
};
const secondaryEmailVerification = (data) => {
    return secondaryEmailVerify.validate(data, options);
};
const login = (data) => {
    return loginSchema.validate(data, options);
};
const validateResetPassword = (data) => {
    return passwordSchema.validate(data, options);
};


module.exports = {
    registerWithEmailAndPassword,
    tokenVerification,
    emailVerification,
    secondaryEmailVerification,
    login,
    validateResetPassword
}

