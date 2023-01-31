import { Response } from "express";

export const exampleController = (_,res: Response) => {
    res.send("Ping");
}