import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import User from "../models/User.js";

import { HttpError, sendEmail } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

import { avatarPath } from "../controllers/contacts-controller.js";
// const avatarsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email alredy in use")
    }

    const hashPassword = await bcrypt.hash(password, 10); // хешуємо

    const verificationCode = nanoid();

    const avatarURL = gravatar.url(email); // тимчасова аватарка

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationCode}); // save hash pass

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verificationCode}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError (404, "Email not found")
    }
    if (user.verify) {
        throw HttpError (400, "Email alredy verify")
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${user.verificationCode}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({
        message: "Verify email send success"
    })
}

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });

    res.json({
        message: "Email verify success",
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token }); //записуємо токен
    res.json({
        token,
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    })
}

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Signout success"
    })
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}

export default {
    signup: ctrlWrapper(signup),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    verify: ctrlWrapper(verify),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
}