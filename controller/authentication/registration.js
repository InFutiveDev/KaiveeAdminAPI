const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('../../models/admin');
const randomString = require('crypto-random-string');
const SignupValidation = require('../../helpers/joi-validation');
const { handleException } = require('../../helpers/exception');
const Response = require('../../helpers/response');
const Constant = require('../../helpers/constant');
const jwt = require('jsonwebtoken')

/**
 * Register a new user with email and password
 */
const registerWithEmailAndPassword = async (req, res) => {
    const { logger } = req;
    try {
        const { name, email, password } = req.body;

        const { error } = SignupValidation.registerWithEmailAndPassword({ name, email, password });
        if (error) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: error.details[0].message,
            };
            return Response.error(obj);
        }

        const userInfo = await User.findOne({ 'email.id': email });
        if (userInfo) {
            const resp = {
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: Constant.ERROR_MSGS.ACCOUNT_EXISTS,
            };
            throw (resp);
        }

        // Encrypt password By Bcrypt
        const passwordHash = bcrypt.hashSync(password, 10);
        // const passwordHash = passwordHash;


        // Email Token Verification
        const token = randomString({
            length: 15,
            type: 'url-safe',
        });





        // Create User Document in Mongodb
        const { _id } = await User.create({
            name,
            email: {
                id: email,
                verified: false,
                registrationType: 'Email',
                password: passwordHash,
                token: {
                    token,
                    createdAt: Date.now(),
                },
            },
        });
        // Send Response To Client
        const obj = {
            res,
            status: Constant.STATUS_CODE.CREATED,
            msg: Constant.INFO_MSGS.VERIFICATION_EMAIL,
            data: {
                _id,
                name,
                email,

                // token,
                // passwordHash
            },
        };
        return Response.success(obj);
    } catch (error) {
        console.log('error--->', error)
        return handleException(logger, res, error);
    }
};

/**
 * Customer Email id verification
 *
 * @param {string} token (token)
 */
const emailVerify = async (req, res) => {
    const { logger } = req;
    try {
        const { error } = SignupValidation.tokenVerification(req.body);
        if (error) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: error.details[0].message,
            };
            return Response.error(obj);
        }
        const { code } = req.body;
        const user = await User.findOne({
            'email.token.token': code,
        });
        if (!user) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: Constant.ERROR_MSGS.INVALID_CODE,
            };
            return Response.error(obj);
        } else if (user.email.verified) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.OK,
                msg: Constant.INFO_MSGS.EMAIL_VERIFIED,
            };
            return Response.success(obj);
        } else {
            const userId = user._id;
            await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'email.verified': true,
                    },
                },
            );
            const obj = {
                res,
                msg: Constant.INFO_MSGS.ACCOUNT_VERIFIED,
                status: Constant.STATUS_CODE.OK,
                data: {
                    name: user.name,
                    email: user.email.id,
                },
            };

            return Response.success(obj);
        }
    } catch (error) {
        console.log('error', error)
        return handleException(logger, res, error);
    }
};




/**
 * Resend Email verification link
 *
 * @param {string} email (Email ID)
 */
const resendEmailVerification = async (req, res) => {
    const { logger } = req;
    try {
        const { error } = SignupValidation.emailVerification(req.body);
        if (error) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: error.details[0].message,
            };
            return Response.error(obj);
        }
        const { email } = req.body;
        const user = await User.findOne({
            'email.id': email,
        });
        if (!user) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.ACCOUNT_NOT_FOUND,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (!user.status) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.ACCOUNT_DISABLED,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (user.email.verified) {
            const obj = {
                res,
                msg: Constant.INFO_MSGS.EMAIL_VERIFIED,
                status: Constant.STATUS_CODE.OK,
            };
            return Response.error(obj);
        } else if (user.email.registrationType == 'Google') {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.EMAIL_VERFICATION_NOT_NEEDED,
                status: Constant.STATUS_CODE.OK,
            };
            return Response.error(obj);
        } else {
            const token = randomString({
                length: 15,
                type: 'url-safe',
            });
            const userInfo = await User.findOneAndUpdate(
                {
                    'email.id': email,
                },
                {
                    'email.token.token': token,
                    'email.token.createdAt': Date.now(),
                },
                {
                    new: true,
                },
            );

            // const payload = {
            //   name: userInfo.name,
            //   verifyLink: `${EMAIL_VERIFICATION_URL}${token}`,
            //   loginLink: `${LOGIN_URL}`,
            // };
            // Email.Email(logger, EMAIL_VERIFY_TEMPLATE_ID, email, payload);

            const obj = {
                res,
                msg: Constant.INFO_MSGS.VERIFICATION_EMAIL,
                status: Constant.STATUS_CODE.OK,
            };

            return Response.success(obj);
        }
    } catch (error) {
        console.log('error', error)
        return handleException(logger, res, error);
    }
};

/**
 * Send a email with token to the user to reset the password
 *
 * @param {string} email (Email Id)
 */
const forgotPasswordLink = async (req, res) => {
    const { logger } = req;
    try {
        const { email, captchaToken } = req.body;
        const { error } = SignupValidation.emailVerification({ email });
        if (error) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: error.details[0].message,
            };
            return Response.error(obj);
        }


        const user = await User.findOne({
            'email.id': email,
        });

        if (!user) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.ACCOUNT_NOT_FOUND,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (!user.status) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.ACCOUNT_DISABLED,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (user.email.registrationType !== 'Email') {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.CHANGE_PASSWORD_NOT_ALLOWED,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (!user.email.verified) {
            const obj = {
                res,
                msg: Constant.INFO_MSGS.EMAIL_NOT_VERIFIED,
                status: Constant.STATUS_CODE.OK,
            };
            return Response.error(obj);
        } else {
            const token = randomString({
                length: 15,
                type: 'url-safe',
            });
            let tokenExpiryDate = moment(new Date(), 'MM-DD-YYYY').add(2, 'hours');

            const userInfo = await User.findOneAndUpdate(
                {
                    'email.id': email,
                },
                {
                    $set: {
                        forgotPassword: {
                            token: token,
                            createdAt: Date.now(),
                            expiryDate: tokenExpiryDate,
                        },
                    },
                },
                {
                    new: true,
                },
            );

            // const payload = {
            //   name: userInfo.name,
            //   verifyLink: `${FORGOT_PASSWORD_URL}${token}`,
            // };
            // await Email.Email(logger, FORGOT_PASSWORD_TEMPLATE_ID, email, payload);
            const obj = {
                res,
                msg: Constant.INFO_MSGS.EMAIL_SEND,
                status: Constant.STATUS_CODE.OK,
            };
            return Response.success(obj);
        }
    } catch (error) {
        console.log('forgotPasswordLink error', error)
        return handleException(logger, res, error);
    }
};

/**
 * Change the customer password
 *
 * @param {string} token (forgot password token)
 * @param {string} password (customer password)
 */
const resetPassword = async (req, res) => {
    const { logger } = req;
    try {
        const { error } = SignupValidation.validateResetPassword(req.body);

        if (error) {
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: error.details[0].message,
            };
            return Response.error(obj);
        }

        const { code, password } = req.body;

        const user = await User.findOne({
            'forgotPassword.token': code,
        });

        if (!user) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.INVALID_CODE,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (!user.status) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.ACCOUNT_DISABLED,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (user.email.registrationType !== 'Email') {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.CHANGE_PASSWORD_NOT_ALLOWED,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else if (!user.email.verified) {
            const obj = {
                res,
                msg: Constant.INFO_MSGS.EMAIL_NOT_VERIFIED,
                status: Constant.STATUS_CODE.OK,
            };
            return Response.error(obj);
        } else if (bcrypt.compareSync(password, user.email.password)) {
            const obj = {
                res,
                msg: Constant.ERROR_MSGS.OLD_PASSWORD,
                status: Constant.STATUS_CODE.BAD_REQUEST,
            };
            return Response.error(obj);
        } else {
            if (user.forgotPassword.expiryDate < new Date()) {
                const obj = {
                    res,
                    msg: Constant.ERROR_MSGS.FORGOT_PASSWORD_TOKEN_EXPIRED,
                    status: Constant.STATUS_CODE.BAD_REQUEST,
                };
                return Response.error(obj);
            }
            const passHash = bcrypt.hashSync(password, 10);
            await User.findOneAndUpdate(
                {
                    'forgotPassword.token': code,
                },
                {
                    $set: {
                        'email.password': passHash,
                        'forgotPassword.token': null,
                        'blocked.status': false,
                        'blocked.expiry': null,
                    },
                },
                {
                    new: true,
                },
            );
            const obj = {
                res,
                msg: Constant.INFO_MSGS.PASSWORD_CHANGED,
                status: Constant.STATUS_CODE.OK,
            };
            return Response.success(obj);
        }
    } catch (error) {
        console.log('resetPassword Error', error);
        return handleException(logger, res, error);
    }
};


module.exports = {
    registerWithEmailAndPassword,
    emailVerify,
    resendEmailVerification,
    forgotPasswordLink,
    resetPassword
}