import express, { Request, Response } from "express"
import cors from "cors";
import errorHandler from "./middleware/error";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

//imports for routes
import bookingRoute from "./routes/bookingRoute";
import userRoutes from "./routes/userRoutes";
import categoryRoute from "./routes/categoryRoute";
import tourActivitiesRoute from  "./routes/toursActivitiesRoute";
import tourGuardRoutes from "./routes/tourGuardRoutes";
import createPayPalPayment from "./utils/paypalIntegration";

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

  app.post("/api/paypal/gateway", async(req: Request, res: Response) => {
    const {amount, useCard, totalAmount} = req.body;

    try {
      const approvalUrl = await createPayPalPayment(amount, useCard, totalAmount);
      res.json({success: true, approvalUrl});
    } catch (error) {
      res.status(500).json({success: false, message: "Payment Creation failed"});
    }
  })

//api endpoint routes
app.use("/api/booking", bookingRoute)
app.use("/api/user", userRoutes);
app.use("/api/activities", tourActivitiesRoute);
app.use("/api/category", categoryRoute);
app.use("/api/tour-guard", tourGuardRoutes)


//for ErrorHandling
app.use(errorHandler)

export default app