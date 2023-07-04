import express from "express"
import cors from "cors";
import errorHandler from "./middleware/error";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

//imports for routes
// import adminRoute from "./routes/adminRoute";
import userRoutes from "./routes/userRoutes";
import categoryRoute from "./routes/categoryRoute";
import tourActivitiesRoute from  "./routes/toursActivitiesRoute";
// import tourRoute from "./routes/tourRoute";

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
// app.use("/api/Admin", adminRoute)
app.use("/api/user", userRoutes);
app.use("/api/activities", tourActivitiesRoute);
app.use("/api/category", categoryRoute);
// app.use("/api/tours", tourRoute);


//for ErrorHandling
app.use(errorHandler)

export default app