import express from "express";
import { exampleController } from "../controllers/exampleController";

const router = express.Router();

router.get("/example", exampleController);

export default router;