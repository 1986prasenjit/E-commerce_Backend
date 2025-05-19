import { validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next()
    }

    const extractedError = [];

    errors.array().map((err) => extractedError.push({
        [err.path] : err.msg
    }))
    return res
    .status(422)
    .json({
        statusCode:422,
        message:"Recieved Data is invalid",
        extractedError
    })
}

export { validate };