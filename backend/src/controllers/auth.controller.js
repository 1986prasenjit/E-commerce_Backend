import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if(existingUser){
            return res
            .status(409)
            .json(
                new ApiError(409, "Email-ID or UserName already exists")
            )
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

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await db.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        return res
        .status(404)
        .json(
            new ApiError(404, "Provided user Credentials not Found")
        )
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        return res
        .status(400)
        .json(
            new ApiError(400, "Email or UserName is Invalid")
        )
    }

    const token = jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

    res.cookie("jwt", token, options)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,"User Logged In Successfully",user
            )
        )
})


const logoutUser = asyncHandler(async(req, res) => {
    try {
        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV !== "development",
            sameSite:"Strict",
            maxAge:1000 * 60 * 60 * 24 * 7,
        }
        return res
        .status(200)
        .clearCookie("jwt", options)
        .json(
            new ApiResponse(200, "User Logged Out Successfully", {})
        )
    } catch (error) {
        return res
        .status(400)
        .json(
            new ApiError(400, "Invalid User Credentials")
        )
    }
})

const getProfile = asyncHandler(async(req, res)=> {
    try {
        return res
        .status(200)
        .json(
            new ApiResponse(200, "User Authencitated Successfully")
        )
        
    } catch (error) {
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Requested User not found")
        )
    }
})

export { registerUser, loginUser, logoutUser, getProfile }  