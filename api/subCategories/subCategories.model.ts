import { model, Schema } from "mongoose";

export const SubCategoriesSchema = new Schema({
    en: {
        type: String,
        required: [true, "en is compulsory"],
        trim: true,
        maxLength: [100, "Maximum characters allowed 100"]
    },
    es: {
        type: String,
        required: [true, "es is compulsory"],
        trim: true,
        maxLength: [100, "Maximum characters allowed 100"]
    },
    owner: {
        type: String,
        required: true,
        select: false
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