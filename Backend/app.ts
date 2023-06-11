import express from "express"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors())

//configurations
if(process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path:"config/.env"
    });
}


export default app