import mongoose from "mongoose";


export interface ICategory extends mongoose.Document{
    title: string,
    imageUrl: string,
}