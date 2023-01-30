import {Schema, model} from 'mongoose';

const CategoriesSchema= new Schema({
    category: {
        type: 'string',
        required: [true, "Category is compulsory"],
        maxLength: 100,     // Including 100 characters
        trim: true
    },
    version: {
        type: 'string',
        required: [true, "Version is compulsory"],
        maxLength: 100,     // Including 100 characters
        trim: true
    }
}, {
    timestamps: true
});

// Index
CategoriesSchema.index({ category: 1, version: 1 }, {unique: true});

const CategoriesModel = model("category", CategoriesSchema);
export {CategoriesModel}