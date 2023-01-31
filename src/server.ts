import express, {Application} from "express";
import cors from "cors";

const app: Application = express();
app.use(cors())
app.use(express.json());

app.listen(7111, () => {
    console.log("Applikácia beží na porte 7111");
})