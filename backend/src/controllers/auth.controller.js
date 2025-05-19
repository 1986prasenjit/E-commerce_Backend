import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHhandler.js";

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return res
                .status(401)
                .json(new ApiError(
                    401, "User-Name or Email-Id already exists"
                ))
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.USER
            }
        })

        const token = jwt.sign(
            {
                id: newUser.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24 * 7
        }

        res.cookie("jwt", token, options)


        return res
            .status(201)
            .json(
                new ApiResponse(201, "User Registered Successfully", newUser)
            )
    } catch (error) {
        return res
            .status(400)
            .json(new ApiError(
                400, "Error while creating User"
            ))
    }
})

export { registerUser }  