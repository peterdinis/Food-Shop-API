import express, {Application} from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import exampleRoute from "./routes/exampleRoutes";

dotenv.config();

const app: Application = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(exampleRoute);

const PORT = process.env.PORT as unknown as number;

app.listen(PORT, () => {
    console.log(`Applikácia beží na porte ${PORT}`);
})