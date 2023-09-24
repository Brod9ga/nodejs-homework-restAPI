import express from "express";
import * as userSchemas from "../../models/User.js";
import validateBody from "../../decorators/walidateBody.js";
import authCTRL from "../../controllers/authCTRL.js";
import authenticate from "../../middlewares/authenticate.js";

const authRouter = express.Router();

const userSignupSchema = validateBody(userSchemas.userSignupSchema)
const userSigninSchema = validateBody(userSchemas.userSigninSchema);

authRouter.post("/register", userSignupSchema, authCTRL.signup);

authRouter.post("/login", userSigninSchema, authCTRL.signin);

authRouter.get("/current", authenticate, authCTRL.getCurrent)

authRouter.post("/logout", authenticate, authCTRL.logout )

export default authRouter