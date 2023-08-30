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
import activityTypeRoutes from "./routes/activityTypeRoutes";

const app = express();

const allowedOrigins = ['http://localhost:3000/', 'https://magnificent-rabanadas-4a5afb.netlify.app/'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));


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

  // app.post("/api/paypal/gateway", async(req: Request, res: Response) => {
  //   const {amount, useCard, totalAmount} = req.body;

  //   try {
  //     const approvalUrl = await createPayPalPayment(amount, useCard, totalAmount);
  //     res.json({success: true, approvalUrl});
  //   } catch (error) {
  //     res.status(500).json({success: false, message: "Payment Creation failed"});
  //   }
  // })

  // New route for PayPal Express Checkout initiation
app.post("/api/paypal/express-checkout", async (req: Request, res: Response) => {
  const { amount, useCard, totalAmount } = req.body;

  try {
    const approvalUrl = await createPayPalPayment(amount, useCard, totalAmount);
    res.json({ success: true, approvalUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Paypal payment creation failed" });
  }
});

//api endpoint routes
app.use("/api/booking", bookingRoute)
app.use("/api/user", userRoutes);
app.use("/api/activities", tourActivitiesRoute);
app.use("/api/category", categoryRoute);
app.use("/api/tour-guard", tourGuardRoutes)


//endpoints to return types 
app.use("/api", activityTypeRoutes)



//for ErrorHandling
app.use(errorHandler)

export default app