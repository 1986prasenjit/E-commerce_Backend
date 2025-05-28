import express from "express";
import cookieParser from "cookie-parser";

//user route
import userRegisterRoute from "./routes/auth.route.js";

//create product route
import createProductRoute from "./routes/product.route.js"

const app = express();

app.use(express.json());

app.use(cookieParser())

//user route
app.use("/api/v1/user", userRegisterRoute);

//create product route
app.use("/api/v1/product", createProductRoute)


export default app;