import { Router } from "express";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { loginValidator, registrationValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/register").post(registrationValidator(),validate,registerUser);

router.route("/login").post(loginValidator(),validate,loginUser);

router.route("/logout").post(authMiddleware,logoutUser);

router.route("/authenticate-user").get(authMiddleware,getProfile);


export default router;