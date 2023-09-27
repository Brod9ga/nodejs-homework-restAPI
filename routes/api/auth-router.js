import express from "express";
import * as userSchemas from "../../models/User.js";
import validateBody from "../../decorators/walidateBody.js";
import authCTRL from "../../controllers/authCTRL.js";
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";
import uploadAvatar from "../../middlewares/uploadAvatar.js";


const authRouter = express.Router();

const userSignupSchema = validateBody(userSchemas.userSignupSchema)
const userSigninSchema = validateBody(userSchemas.userSigninSchema);
const userUpdateAvatarSchema = validateBody(userSchemas.userUpdateAvatar)
const userEmailSchema = validateBody(userSchemas.userEmailSchema);

authRouter.post("/register", userSignupSchema, authCTRL.signup);

authRouter.post("/login", userSigninSchema, authCTRL.signin);

authRouter.get("/verify/:verificationToken", authCTRL.verify);

authRouter.post("/verify", userEmailSchema, authCTRL.resendVerifyEmail);

authRouter.get("/current", authenticate, authCTRL.getCurrent)

authRouter.post("/logout", authenticate, authCTRL.logout)

authRouter.patch("/avatars",authenticate,  uploadAvatar.single('avatar'), authCTRL.updateAvatar)

export default authRouter