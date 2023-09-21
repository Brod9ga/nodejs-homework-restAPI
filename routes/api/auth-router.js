import express from "express";
import * as userSchemas from "../../models/User.js";
import validateBody from "../../decorators/walidateBody.js";
import authCTRL from "../../controllers/authCTRL.js";


const authRouter = express.Router();

const userSignupSchema = validateBody(userSchemas.userSignupSchema)

authRouter.post("/register", userSignupSchema, authCTRL.signup);
export default authRouter