import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/index.js";

const registerUser = async(req, res) => {
   try {
     const { name, email, password } = req.body;
 
     const existingUser = await db.user.findUnique({
         where:{
             email
         }
     })
 
     if(existingUser){
         return res
         .status(401)
         .json({
             statusCode:400,
             message:"Email or UserName already exits"
         })
     }
 
     const hashedPassword = await bcrypt.hash(password, 10);
 
     const newUser = await db.user.create({
         data:{
             name,
             email,
             password:hashedPassword,
             role: UserRole.USER
         }
     })

     const token = jwt.sign(
        {
        id:newUser.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )

    const options = {
        httpOnly:true,
        secure:true,
        sameSite: 'Strict',
        maxAge:1000 * 60 * 60 * 24 * 7
    }

    res.cookie("jwt", token, options)


     return res.status(200).json({ 
         status:200, 
         message: "User Register Successfully",
         newUser
     })
   } catch (error) {
    return res.status(401).json({ 
        status:401, 
        message: "Error while Registering the User",
    })
   }
}

export { registerUser }  