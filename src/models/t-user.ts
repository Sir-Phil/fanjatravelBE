import mongoose from "mongoose";
import { ITemporalUser } from "../interface/t-user";

const tUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
},{
    timestamps: true
})

const Tuser = mongoose.model<ITemporalUser>("Tuser", tUserSchema)

export default Tuser;