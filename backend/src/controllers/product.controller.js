import { db } from "../libs/db.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const createProduct = asyncHandler(async (req, res) => {
    const { name, description, tags, price } = req.body;

    const existingProduct = await db.product.findUnique({
        where: {
            name
        }
    })

    if (existingProduct) {
        return res
            .status(409)
            .json(
                new ApiError(409, "Requested Product already exists")
            )
    }

    const newProduct = await db.product.create({
        data:{
            name,
            description, 
            price,
            tags: req.body.tags.join(",")
        }
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, "Product Created Successfully", newProduct)
    )
})

export { createProduct }