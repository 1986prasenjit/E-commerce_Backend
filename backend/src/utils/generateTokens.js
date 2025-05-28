import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
})

const generateTempTokens = function () {
    const unHashedToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokensExpiry = Date.now() + 1000 * 60 * 60 * 12;

    return {
        unHashedToken, hashedToken, tokensExpiry
    }

}

const generateAccessToken = function (user) {
    return jwt.sign({
        id: user.id,
    },
        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateRefreshToken = function (user) {
    return jwt.sign({
        id: user.id,
    },
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}