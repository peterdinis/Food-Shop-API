import { PrismaClient } from "@prisma/client";
import {Request, Response } from "express";

const prisma = new PrismaClient()

export const displayAllProducts = async (req: Request, res: Response) => {
    const allProducts = await prisma.product.findMany();
    return allProducts;
}

export const productDetails = async (req: Request, res: Response) => {
    const {id} = req.params;

    const oneProduct = await prisma.product.findFirst({
        where: {id: Number(id)}
    })

    if(!oneProduct) {
        throw new Error("Requested product not found");
    }

    return oneProduct;
}

export const createProduct = async (req: Request, res: Response) => {
    return await prisma.product.create({
        data: {
            ...req.body
        }
    })
}