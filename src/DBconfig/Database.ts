import mongoose, { ConnectOptions } from "mongoose";


const dbConnection = () => {
    mongoose.connect(process.env.DB_PATH as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then((data) => {
        console.log(`mongoDB connected successfully with server: ${data.connection.host}`);
    })
}

export default dbConnection;
