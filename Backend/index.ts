import dbConnection from "./DBconfig/Database";
import app from "./app";


//This Handle uncaught Exception
process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down for handling uncaught exception`)
});

//configurations
if (process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path: "config/.env"
    });
}

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
