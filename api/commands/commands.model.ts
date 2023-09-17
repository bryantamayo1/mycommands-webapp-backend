import { Schema } from "mongoose";
import { errorMessages, languages } from "../utils/constants";

export const CommandsSchema = new Schema({
    command: {
        type: String,
        required: [true, "command is compulsory"],
        maxLength: [10000, errorMessages[10000]],     // Including 10000 characters
        trim: true
    },
    language: {
        type: String,
        enum: languages,
        required: [true, "language is compulsory"],
    },
    en: {
        type: String,
        required: [true, "en is compulsory"],
        maxLength: [10000, errorMessages[10000]],     // Including 10000 characters
        trim: true
    },
    es: {
        type: String,
        required: [true, "es is compulsory"],
        maxLength: [10000, errorMessages[10000]],     // Including 10000 characters
        trim: true
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