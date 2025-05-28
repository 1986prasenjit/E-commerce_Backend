import { body } from "express-validator";

const registrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required to proceed")
            .isEmail().withMessage("Provided Email is Invalid"),
        body("name")
            .trim()
            .notEmpty()
            .withMessage("User Name is required to proceed")
            .isLength({ min: 3, max: 13 })
            .withMessage("userName should be at least of 3 Chars and should not exceed 13 chars"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required to proceed")
            .isLength({ min: 8, max: 15 })
            .withMessage("Password should be at least of 8 Chars and should not exceed 15 chars"),
    ]
}

const loginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required to proceed")
            .isEmail().withMessage("Provided Email is Invalid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required to proceed")
            .isLength({ min: 8, max: 15 })
            .withMessage("Password should be at least of 8 Chars and should not exceed 15 chars"),
    ]
}

const createProductValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Product Name is required to proceed")
            .isLength({ min: 3})
            .withMessage("Porduct Name should be at least of 3 Chars"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Product Description is required")
            .isLength({min: 20})
            .withMessage("Description should be at least of 20 Chars"),
        body("tags")
            .trim()
            .notEmpty()
            .withMessage("Tags Should not be empty")
            .isArray(),
        body("price")
            .trim()
            .notEmpty()
            .withMessage("Price is required")
    ]
}

export { registrationValidator, loginValidator, createProductValidator }