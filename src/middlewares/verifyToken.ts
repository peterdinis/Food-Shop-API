import { NextFunction, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {verify} from "jsonwebtoken";
import { UnauthorizedError } from '../utils/helperErrors';
import { getErrorMessage } from '../utils/catchErrorMessage';

const prisma = new PrismaClient();

export const verifyToken = async (req: any, _: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        // Cut the received string and takes the token at position 1.
        const token = authorization;
        /* debugger; */
        const payload: any = verify(token, "SECRET");

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
    } catch (error) {
        getErrorMessage(error);
    }
};