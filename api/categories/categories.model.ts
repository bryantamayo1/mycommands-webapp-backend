import {Schema, model} from 'mongoose';
import { CommandsSchema } from '../commands/commands.model';
import { errorMessages } from '../utils/constants';

const CategoriesSchema = new Schema({
    category: {
        type: String,
        required: [true, "category is compulsory"],
        maxLength: [100, errorMessages[100]],     // Including 100 characters
        trim: true
    },
    version: {
        type: String,
        required: [true, "version is compulsory"],
        maxLength: [100, errorMessages[100]],     // Including 100 characters
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
        select: true
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