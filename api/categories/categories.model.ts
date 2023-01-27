import {Schema, model} from 'mongoose';

const CategoriesSchema= new Schema({
    category: {
        type: 'string',
        required: [true, "Category is compulsory"],
        trim: true
    }
});

const CategoriesModel = model("categories", CategoriesSchema);
export {CategoriesModel}