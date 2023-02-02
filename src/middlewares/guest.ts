import { Response, NextFunction } from "express";

export const guestMiddleware = (req: any, res: Response, next: NextFunction) => {
    if(!req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}