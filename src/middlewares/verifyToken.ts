import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {verify} from "jsonwebtoken";
import dotenv from "dotenv";
import { ForbiddenError, UnauthorizedError } from '../utils/helperErrors';

const prisma = new PrismaClient();

dotenv.config();

export const verifyToken = async (req: any, _: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;

        // Cut the received string and takes the token at position 1.
        const token = authorization && authorization.split(' ')[1] || '';

        const payload: any = verify(token, process.env.JWT_SECRET as string);

        if (!payload)
            throw new UnauthorizedError();

        const user = await prisma.user.findFirst({
            where: {
                id: payload.id
            }
        });

        if (!user)
            throw new UnauthorizedError();

        const { password, ...loggedUser } = user;
        req.user = loggedUser;

        next();
    } catch (error: any) {
        throw new ForbiddenError();
    }
};