import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js"

import { userSignupSchema, userSigninSchema } from "../../models/User.js";
import { authenticate, upload } from "../../middelewares/index.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(userSignupSchema), authController.signup)

authRouter.post("/signin", validateBody(userSigninSchema), authController.signin)

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch("/avatars",authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;