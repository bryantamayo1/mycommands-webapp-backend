import {Schema, model} from 'mongoose';
import { SubCategoriesSchema } from '../subCategories/subCategories.model';

const CommandsSchema = new Schema({
    command: {
        type: String,
        required: [true, "command is compulsory"],
        trim: true
    },
    en: {
        type: String,
        required: [true, "en is compulsory"],
        trim: true
    },
    es: {
        type: String,
        required: [true, "es is compulsory"],
        trim: true
    },
    owner: {
        type: String,
        required: true,
        select: false
    }
}, {
    timestamps: true
});

const CategoriesSchema = new Schema({
    category: {
        type: String,
        required: [true, "category is compulsory"],
        maxLength: 100,     // Including 100 characters
        trim: true
    },
    version: {
        type: String,
        required: [true, "version is compulsory"],
        maxLength: 100,     // Including 100 characters
        trim: true
    },
    commands: {
        type: [CommandsSchema], 
        default: []
    },
    subCategories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'subcategories'
        }
    ],
    owner: {
        type: String,
        required: true,
        select: false
    }
}, {
    timestamps: true
});


// Index
CategoriesSchema.index({ category: 1, version: 1 }, {unique: true});

// Methods
CategoriesSchema.methods.toJSON = function(){
    const {__v, ...categories} = this.toObject();
    // Change _id by id
    // projects.id = projects._id;
    // delete projects._id;
    return categories;
}

const CategoriesModel = model("category", CategoriesSchema);
export {CategoriesModel}