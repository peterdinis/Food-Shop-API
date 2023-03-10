import { PrismaClient } from "@prisma/client";
import {Request, Response } from "express";
import validate from "../validators/validateSchema";
import productSchema from "../validators/productSchema";

const prisma = new PrismaClient()

export const displayAllProducts = async (req: Request, res: Response) => {
    const allProducts = await prisma.product.findMany();
    return res.json(allProducts);
}

export const productDetails = async (req: Request, res: Response) => {
    const {id} = req.params;

    const oneProduct = await prisma.product.findFirst({
        where: {id: Number(id)}
    })

    if(!oneProduct) {
        throw new Error("Requested product not found");
    }

    return res.json(oneProduct);
}

export const createProduct = async (req: Request, res: Response) => {
    validate(productSchema);
    const newProduct = await prisma.product.create({
        data: {
            ...req.body
        }
    })

    return res.json(newProduct);
}