import { Schema } from "mongoose";

export const CommandsSchema = new Schema({
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