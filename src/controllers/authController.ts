import { PrismaClient } from "@prisma/client";
import {Request, Response } from "express";
import {registerSchema} from "../validators/userSchema"
import bcrypt, { compare } from "bcrypt";
import validate from "../validators/validateSchema";
import {sign, verify} from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    validate(registerSchema)

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


export const loginUser = async (req: Request, res: Response) => {

    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email          
        }
    });

    if(!user) {
        throw new Error("Requested user not found");
    }

    const verifyPassword = await compare(password, user.password);

    if(!verifyPassword) {
        throw new Error("Invalid password or email");
    }

    const refreshToken = sign({
        id: user.id,
        name: user.name
    }, process.env.JWT_REFRESH_TOKEN as string, {expiresIn: process.env.JWT_EXPIRATION_IN_SECONDS as string})

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000, secure: true });

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);

    await prisma.token.create({
        data: { 
            userId: user!.id,
            token: refreshToken,
            expiredAt
        }
    })

    const token = sign({ id: user.id, name: user.name }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRES_IN_JWT_SECRET });

    return res.json({
        token: token,
        user: user
    })
}

export const refreshTokenFn = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];

    const payload: any = verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

    if(!payload) {
        throw new Error("You are not authorized");
    }

    const dbToken = await prisma.token.findFirst({
        where: {
            userId: payload.id,
        }
    })

    if(!dbToken) {
        throw new Error("You are not authorized");
    }

    const token = sign({ id: payload.id, name: payload.name }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRES_IN_JWT_SECRET });

    return res.status(200).send({ token });
}

export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];
    if(!refreshToken) {
        throw new Error("You are not authorized");
    }

    await prisma.token.delete({
        where: {
            token: refreshToken
        }
    });

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', maxAge: 0, secure: true });

    return res.sendStatus(204);
}

export const myProfile = async(req: any, res: Response) => {
    return res.status(200).json({ user: req.user });
}