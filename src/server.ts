import express, {Application} from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import exampleRoute from "./routes/exampleRoutes";
import productRoute from "./routes/productRoutes";
import authRoute from "./routes/authRoutes"

dotenv.config();

export const app: Application = express();

app.use(cors({ origin: process.env.FRONTEND_URL}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(exampleRoute);
app.use(productRoute);
app.use(authRoute);

const PORT = process.env.PORT as unknown as number;

app.listen(PORT, () => {
    console.log(`Applikácia beží na porte ${PORT}`);
})