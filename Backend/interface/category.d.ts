import mongoose from "mongoose";


export interface ICategory extends mongoose.Document{
    name: string,
    title: string,
    place:string,
    imageUrl: string,
}