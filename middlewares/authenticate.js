import jwt from "jsonwebtoken"
import { ctrlWrapper } from "../decorators/index.js ";
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";

const {JWT_SECRET} = process.env

const authorization = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        throw HttpError(401);
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user) {console.log(user, id);
            throw HttpError(401);
        }
        req.user = user;
        next();
    }
    catch {
        throw HttpError(401);
    }
}

export default ctrlWrapper(authorization);
