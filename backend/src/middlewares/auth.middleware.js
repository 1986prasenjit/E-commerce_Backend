import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";
import { ApiError } from "../utils/apiErrors.js"



const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.jwt || req.header("Authorization ")?.replace("Bearer ", "");

    if(!token){
        return res
        .status(409)
        .json(
            new ApiError(409, "Unauthorized or Invalid User Token")
        )
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    if(!decodedToken){
        return res
        .status(401)
        .json(
            new ApiError(401, "Invalid User Token")
        )
    }

    const verifyuser = await db.user.findUnique({
        where: {
            id: decodedToken.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
        }
    })

    if(!verifyuser){
        return res
        .status(401)
        .json(
            new ApiError(401, "Provided User Credentials is invalid")
        )
    }

    req.user = verifyuser;

    next()
})

export { authMiddleware }