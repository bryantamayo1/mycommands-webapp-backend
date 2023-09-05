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
exports.deleteFilter = exports.modificateFilter = exports.createFilter = exports.findFilters = void 0;
const categories_model_1 = require("../categories/categories.model");
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
const AppError_1 = require("../manage-errors/AppError");
/**
 * Return the filters to search and count the access to web page
 * @returns Array with filters
 */
exports.findFilters = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lang } = req.params;
    // Validations
    if (!(lang === "en" || lang === "es")) {
        return next(new AppError_1.AppError("Query lan can be 'en' or 'es'", constants_1.httpCodes.bad_request));
    }
    const found = yield categories_model_1.CategoriesModel.find().populate("subCategories");
    let totalCommands = 0;
    // Building response
    const cleanData = found.map(item => {
        totalCommands += item.commands.length;
        let subCategories = undefined;
        if (item.subCategories.length > 0) {
            subCategories = item.subCategories.map((e) => {
                return {
                    [lang]: e[lang],
                    color: e.color,
                    _id: e._id,
                    // @ts-ignore
                    owner: e.owner
                };
            });
            // Add subCategory 'All' by default
            subCategories.unshift({
                [lang]: lang === "en" ? "All" : "Todos",
                color: "pink",
                _id: "all",
                owner: 'everybody'
            });
        }
        return {
            category: item.category,
            subCategories: subCategories,
            version: item.version,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            results: item.commands.length,
            _id: item._id,
            owner: item.owner
        };
    });
    // Store category by defualt 'All'
    cleanData.unshift({
        category: lang === "en" ? "All" : "Todas",
        results: totalCommands,
        // @ts-ignore
        _id: "all"
    });
    return res.json({
        status: "success",
        lang,
        totalCommands,
        results: cleanData.length,
        data: cleanData
    });
}));
exports.createFilter = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validations
    if ((0, utils_1.bodyIsEmpty)(req.body)) {
        return next(new AppError_1.AppError("Body is empty", constants_1.httpCodes.bad_request));
    }
    else if (!req.body.category || !req.body.version) {
        return next(new AppError_1.AppError("Category and version are compulsories", constants_1.httpCodes.bad_request));
    }
    const newFilter = yield categories_model_1.CategoriesModel.create(Object.assign(Object.assign({ owner: req.user._id }, req.body), { commands: [] // By default commands is empty  
     }));
    return res.status(constants_1.httpCodes.created).json({
        status: "success",
        data: {
            category: newFilter.category,
            version: newFilter.version
        }
    });
}));
/**
 * Update one filter by category and version
 */
exports.modificateFilter = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_filter } = req.params;
    const { category, version } = req.body;
    let properties = {};
    // Validations
    if ((0, utils_1.bodyIsEmpty)(req.body)) {
        return next(new AppError_1.AppError("Body is empty", constants_1.httpCodes.bad_request));
    }
    else if (!id_filter) {
        return next(new AppError_1.AppError("Error E1", constants_1.httpCodes.bad_request));
    }
    else if (category && version) {
        properties = { category, version };
    }
    // Check owner of item
    const ifMyItem = yield categories_model_1.CategoriesModel.findOne({ _id: id_filter, owner: req.user._id.toString() });
    if (!ifMyItem) {
        return next(new AppError_1.AppError("Action not allowed", constants_1.httpCodes.forbidden));
    }
    const found = yield categories_model_1.CategoriesModel.findByIdAndUpdate(id_filter, Object.assign({}, properties), {
        new: true,
        runValidators: true
    });
    if (!found) {
        return next(new AppError_1.AppError("Filter not found", constants_1.httpCodes.not_found));
    }
    return res.json({
        status: "success",
        data: {
            category: found.category,
            version: found.version,
        }
    });
}));
/**
 * Delete one filter by unique id
 */
exports.deleteFilter = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_filter } = req.params;
    // Validations
    if (!id_filter) {
        return next(new AppError_1.AppError("ID filter empty", constants_1.httpCodes.bad_request));
    }
    // 1º Check owner of item
    const ifMyItem = yield categories_model_1.CategoriesModel.findOne({ _id: id_filter, owner: req.user._id.toString() });
    if (!ifMyItem) {
        return next(new AppError_1.AppError("Action not allowed", constants_1.httpCodes.forbidden));
    }
    // 2ª Delete filter
    const foundFilter = yield categories_model_1.CategoriesModel.deleteOne({ _id: id_filter });
    if (foundFilter.deletedCount !== 1) {
        return next(new AppError_1.AppError("ID filter doesn't exist", constants_1.httpCodes.not_found));
    }
    else {
        return res.json({
            status: "success",
            data: null
        });
    }
}));
//# sourceMappingURL=filters.controller.js.map