"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
exports.CommandsSchema = new mongoose_1.Schema({
    command: {
        type: String,
        required: [true, "command is compulsory"],
        maxLength: [500, constants_1.errorMessages[500]],
        trim: true
    },
    language: {
        type: String,
        enum: constants_1.languages,
        required: [true, "language is compulsory"],
    },
    en: {
        type: String,
        required: [true, "en is compulsory"],
        maxLength: [500, constants_1.errorMessages[500]],
        trim: true
    },
    es: {
        type: String,
        required: [true, "es is compulsory"],
        maxLength: [500, constants_1.errorMessages[500]],
        trim: true
    },
    subCategories: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
//# sourceMappingURL=commands.model.js.map