import { model, Schema } from "mongoose";
import { colorsEnum, errorMessages } from "../utils/constants";

export const SubCategoriesSchema = new Schema({
    en: {
        type: String,
        required: [true, "en is compulsory"],
        trim: true,
        maxLength: [100, errorMessages[100]],     // Including 500 characters
    },
    es: {
        type: String,
        required: [true, "es is compulsory"],
        trim: true,
        maxLength: [100, errorMessages[100]],     // Including 500 characters
    },
    owner: {
        type: String,
        required: true,
        select: true
    },
    color: {
        type: String,
        enum: colorsEnum,
        required: true,
        maxLength: [100, errorMessages[100]],     // Including 500 characters
    }
}, {
    timestamps: true
});

SubCategoriesSchema.methods.toJSON = function(){
    const {__v, createdAt, updatedAt, ...subCategories} = this.toObject();
    // Change _id by id
    // projects.id = projects._id;
    // delete projects._id;
    return subCategories;
}

const SubCategoriesModel = model("subcategories", SubCategoriesSchema);
export {SubCategoriesModel}