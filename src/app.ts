import express from "express"
import cors from "cors";
import errorHandler from "./middleware/error";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

//imports for routes
import userRoutes from "./routes/userRoutes";
import categoryRoute from "./routes/categoryRoute";
import tourActivitiesRoute from  "./routes/tourActivitiesRoute"

const app = express();

app.use(cors())

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./uploads")));
app.use("/test", (_req, res) => {
    res.send("HI")
});

app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "config/.env",
    });

    
  }

//api endpoint routes
app.use("/api/user", userRoutes);
app.use("/api/activities", tourActivitiesRoute);
app.use("/api/category", categoryRoute);


//for ErrorHandling
app.use(errorHandler)

export default app