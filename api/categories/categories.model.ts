import {Schema, model} from 'mongoose';

const CommandsSchema = new Schema({
    command: {
        type: 'string',
        required: [true, "Command is compulsory"],
    },
    en: {
        type: 'string',
        required: [true, "Command is compulsory"],
    },
    es: {
        type: 'string',
        required: [true, "Command is compulsory"],
    },
});

const CategoriesSchema = new Schema({
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
    },
    commands: {
        type: [CommandsSchema], 
        default: []
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