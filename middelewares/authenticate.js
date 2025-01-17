import jwt from "jsonwebtoken";

import { HttpError } from "../helpers/index.js";

import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401));
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user || !user.token) {
            return next(HttpError(401));
        }
        req.user = user; // дає можливість отримати інформацію користувача, яку використаємо в add
        next();
    } catch (error) {
        next(HttpError(401, error.message));
    }
}

export default authenticate;