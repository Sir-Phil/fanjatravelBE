import dbConnection from "./DBconfig/Database";
import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();


//This Handle uncaught Exception
process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down for handling uncaught exception`)
});


//connection to database
dbConnection();

// here's the server
const server = app.listen(process.env.PORT, () => {
    console.log(
        `Server running on http://localhost:${process.env.PORT}`
    );
});


//for unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Server is shutting down for ${err}`);
    console.log(`Server is shutting down for unhandled promise rejection`);

    server.close(() => {
        process.exit(1)
    });
});
