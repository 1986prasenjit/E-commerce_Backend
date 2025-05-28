import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import { createProductValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/create-product").post(authMiddleware, checkAdmin, createProductValidator(), validate, createProduct)


export default router