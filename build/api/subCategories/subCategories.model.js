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
exports.SubCategoriesModel = exports.SubCategoriesSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
exports.SubCategoriesSchema = new mongoose_1.Schema({
    en: {
        type: String,
        required: [true, "en is compulsory"],
        trim: true,
        maxLength: [100, constants_1.errorMessages[100]], // Including 500 characters
    },
    es: {
        type: String,
        required: [true, "es is compulsory"],
        trim: true,
        maxLength: [100, constants_1.errorMessages[100]], // Including 500 characters
    },
    owner: {
        type: String,
        required: true,
        select: true
    },
    color: {
        type: String,
        enum: constants_1.colorsEnum,
        required: true,
        maxLength: [100, constants_1.errorMessages[100]], // Including 500 characters
    }
}, {
    timestamps: true
});
exports.SubCategoriesSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, createdAt, updatedAt } = _a, subCategories = __rest(_a, ["__v", "createdAt", "updatedAt"]);
    // Change _id by id
    // projects.id = projects._id;
    // delete projects._id;
    return subCategories;
};
const SubCategoriesModel = (0, mongoose_1.model)("subcategories", exports.SubCategoriesSchema);
exports.SubCategoriesModel = SubCategoriesModel;
//# sourceMappingURL=subCategories.model.js.map