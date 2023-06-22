import mongoose from "mongoose";
import { ICategory } from "../interface/category";


const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    
    title: {
        type: String,
        required: true,
    },

    place: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true
    }

},
{
    timestamps: true
}
);

const Category = mongoose.model<ICategory>("Category", categorySchema)
export default Category