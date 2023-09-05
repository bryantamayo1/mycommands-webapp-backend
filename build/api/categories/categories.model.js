"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModel = void 0;
const mongoose_1 = require("mongoose");
const commands_model_1 = require("../commands/commands.model");
const constants_1 = require("../utils/constants");
const CategoriesSchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: [true, "category is compulsory"],
        maxLength: [100, constants_1.errorMessages[100]],
        trim: true
    },
    version: {
        type: String,
        required: [true, "version is compulsory"],
        maxLength: [100, constants_1.errorMessages[100]],
        trim: true
    },
    commands: {
        type: [commands_model_1.CommandsSchema],
        default: []
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
// Index
CategoriesSchema.index({ category: 1, version: 1 }, { unique: true });
// Methods
CategoriesSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v } = _a, categories = __rest(_a, ["__v"]);
    // Change _id by id
    // projects.id = projects._id;
    // delete projects._id;
    return categories;
};
const CategoriesModel = (0, mongoose_1.model)("category", CategoriesSchema);
exports.CategoriesModel = CategoriesModel;
//# sourceMappingURL=categories.model.js.map