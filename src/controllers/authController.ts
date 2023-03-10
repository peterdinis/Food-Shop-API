import { PrismaClient } from "@prisma/client";
import {Request, Response } from "express";
import {registerSchema} from "../validators/userSchema"
import bcrypt, { compare } from "bcrypt";
import validate from "../validators/validateSchema";
import {sign, verify} from "jsonwebtoken";

const prisma = new PrismaClient();

export const allRegisterUsers = async (req: Request, res: Response) => {
    const allUsers = await prisma.user.findMany();
    return allUsers;
}

export const userInfo = async (req: Request, res: Response) => {
    const {email} = req.params;
    const oneUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!oneUser) {
        throw new Error("User with this email not found");
    }

    return oneUser;
}

export const registerUser = async (req: Request, res: Response) => {
    validate(registerSchema)

    const {name, password, email} = req.body;

    if(!name || !password || !email) {
        throw new Error("All fields are required");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const checkIfEmailExists = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(checkIfEmailExists) {
        throw new Error("Requested email aleready exists try another");
    }

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

    const {name, email, password} = req.body;
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
    }, "SECRET", {expiresIn: "3600"})

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

    const token = sign({ id: user.id, name: user.name }, "SECRET", { expiresIn: "3600" });

    return res.json({
        token: token,
        user: user
    })
}

export const refreshTokenFn = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken'];

    const payload: any = verify(refreshToken, "SECRET");

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

    const token = sign({ id: payload.id, name: payload.name }, "SECRET", { expiresIn: "3600" });

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