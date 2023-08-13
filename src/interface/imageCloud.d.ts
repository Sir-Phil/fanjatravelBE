import mongoose from "mongoose";

export interface IImage extends mongoose.Document{
    _id: string;
    url: string;
    public_id: string;
}
