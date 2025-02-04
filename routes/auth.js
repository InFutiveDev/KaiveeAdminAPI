const { Router } = require("express");
const authRouter = Router();
const Registration = require("../controller/authentication/registration");
const Login = require("../controller/authentication/login");

// for route test
authRouter.get("/", (req, res) => {
  res.status(200).json({ message: "AdminAuth Router is working" });
});

authRouter.post("/register/email", Registration.registerWithEmailAndPassword);

authRouter.post("/email-verify", Registration.emailVerify);
authRouter.post("/resend-email", Registration.resendEmailVerification);
// router.post('/forgot-password', Registration.forgotPasswordLink);
authRouter.post("/reset-password", Registration.resetPassword);
authRouter.post("/login", Login.login);

authRouter.post("/token", Login.refreshToken);

module.exports = authRouter;
