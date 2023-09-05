"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = void 0;
const categories_model_1 = require("../categories/categories.model");
const AppError_1 = require("../manage-errors/AppError");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
const subCategories_model_1 = require("./subCategories.model");
exports.createCategory = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_category } = req.params;
    // Validations
    if (!id_category) {
        return next(new AppError_1.AppError("This category doesn’t exist", constants_1.httpCodes.bad_request));
    }
    if ((0, utils_1.bodyIsEmpty)(req.body)) {
        return next(new AppError_1.AppError("Body is empty", constants_1.httpCodes.bad_request));
    }
    const foundCategory = yield categories_model_1.CategoriesModel.findById(id_category);
    if (!foundCategory) {
        return next(new AppError_1.AppError("This category doesn’t exist", constants_1.httpCodes.bad_request));
    }
    // POST
    const created = yield subCategories_model_1.SubCategoriesModel.create(Object.assign({ owner: req.user._id }, req.body));
    yield categories_model_1.CategoriesModel.findByIdAndUpdate(id_category, {
        "$push": {
            "subCategories": created._id
        }
    });
    return res.status(constants_1.httpCodes.created).json({
        status: "success",
        data: req.body
    });
}));
//# sourceMappingURL=subCategories.controller.js.map