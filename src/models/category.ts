import mongoose from "mongoose";
import { ICategory } from "../interface/category";


const categorySchema = new mongoose.Schema({
    title: {
        type: String,
    },

    imageUrl: {
        type: String,
       
    }
},
{
    timestamps: true
}
);

const Category = mongoose.model<ICategory>("Category", categorySchema)
export default Category