import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import userSchema from "../validators/userSchema"
import bcrypt from "bcrypt";
import validate from "../validators/validateSchema";
import {sign, verify} from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    validate(userSchema)

    const {name, password, email} = req.body;

    const userExists = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!userExists) {
        throw new Error("User not found");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashPassword
        }
    })

    return res.json(newUser);
}