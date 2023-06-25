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
// import mongoose, { ConnectOptions } from 'mongoose';

// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(process.env.DB_PATH as string, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     } as ConnectOptions);

//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit the process with a non-zero code
//   }
// };

// export default connectDB;
