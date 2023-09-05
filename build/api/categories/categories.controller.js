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
exports.deleteCommand = exports.modificateCommand = exports.createCommand = exports.searchCommandsGeneral = exports.searchCommandsByLanguage = void 0;
const AppError_1 = require("../manage-errors/AppError");
const subCategories_model_1 = require("../subCategories/subCategories.model");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
const categories_model_1 = require("./categories.model");
/**
 * Find commands by command, lang or meaning. Lang can be in 'en' or 'es' with pagination.
 * Having in consideration upper and lower case
 * Path:
 *      lang: [compulsory] 'en' or 'es'
 * Queryparams:
 *      category: [compulsory] with default 'all'. It must be id of MongoDB or 'all'
 *      commands: it's opcional and it can't be ""
 *      meaning: it's opcional and it can't be ""
 *      subcategory: it's opcional, it has mongo’s id
 * Possiblities in queries
 *      ?category=any
 *      ?category=any&command=any
 *      ?category=any&meaning=any
 *      ?category=any&command=any&meaning=any
 *      ?category=any&command=any&meaning=any&subcategory
 */
exports.searchCommandsByLanguage = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, command, meaning, page, subcategory } = req.query;
    let newPage = +page || 1;
    let total = 0;
    const limitPage = 20;
    const { lang } = req.params;
    // Validations
    if (!category || command === "" || meaning === "") {
        return next(new AppError_1.AppError("Error queries", constants_1.httpCodes.bad_request));
    }
    if (!(lang === "en" || lang === "es")) {
        return next(new AppError_1.AppError("Query lan can be 'en' or 'es'", constants_1.httpCodes.bad_request));
    }
    // 1º Case
    // If category = all
    if (category === "all") {
        let found = yield categories_model_1.CategoriesModel.find();
        const commandsFound = JSON.parse(JSON.stringify(found));
        return getCommandsWithSubCategoriesByAllCategories(commandsFound, command, meaning, lang, newPage, total, limitPage, subcategory, res);
        // 2º Case
    }
    else {
        let found = yield categories_model_1.CategoriesModel.findById(category);
        const commandsFound = JSON.parse(JSON.stringify(found));
        // All in one buffer, is easer to work
        return getCommandsWithSubCategoriesById(commandsFound, command, meaning, lang, newPage, total, limitPage, subcategory, res);
    }
}));
exports.searchCommandsGeneral = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, command, meaning, page, subcategory } = req.query;
    let newPage = +page || 1;
    let total = 0;
    const limitPage = 20;
    const lang = ""; // Like null or undefined
    // Validations
    if (!category || command === "" || meaning === "") {
        return next(new AppError_1.AppError("Error queries", constants_1.httpCodes.bad_request));
    }
    // 1º Case
    // If category = all
    if (category === "all") {
        let found = yield categories_model_1.CategoriesModel.find();
        const commandsFound = JSON.parse(JSON.stringify(found));
        return getCommandsWithSubCategoriesByAllCategories(commandsFound, command, meaning, lang, newPage, total, limitPage, subcategory, res);
        // 2º Case
    }
    else {
        let found = yield categories_model_1.CategoriesModel.findById(category);
        const commandsFound = JSON.parse(JSON.stringify(found));
        // All in one buffer, is easer to work
        return getCommandsWithSubCategoriesById(commandsFound, command, meaning, lang, newPage, total, limitPage, subcategory, res);
    }
}));
/**
 * Create command by id of filters
 */
exports.createCommand = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_filter } = req.params;
    // Validations
    if ((0, utils_1.bodyIsEmpty)(req.body)) {
        return next(new AppError_1.AppError("Body is empty", constants_1.httpCodes.bad_request));
    }
    // Update
    const found = yield categories_model_1.CategoriesModel.findByIdAndUpdate(id_filter, {
        $push: {
            commands: Object.assign({ owner: req.user._id }, req.body),
        }
    }, {
        new: true,
        runValidators: true
    });
    if (!found) {
        return next(new AppError_1.AppError("Filter not found", constants_1.httpCodes.not_found));
    }
    return res.status(constants_1.httpCodes.created).json({
        status: "success"
    });
}));
/**
 * Modificate command by id of filters
 */
exports.modificateCommand = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_filter, id_command } = req.params;
    const { command, en, es } = req.body;
    // Validations
    if ((0, utils_1.bodyIsEmpty)(req.body)) {
        return next(new AppError_1.AppError("Body is empty", constants_1.httpCodes.bad_request));
    }
    // Steps to modificate one command
    // 1) Find filter
    const foundFilter = yield categories_model_1.CategoriesModel.findById(id_filter);
    if (!foundFilter) {
        return next(new AppError_1.AppError("Filter not found", constants_1.httpCodes.not_found));
    }
    // 2) Check owner of item
    const ifMyItem = yield categories_model_1.CategoriesModel.findOne({
        'commands': {
            $elemMatch: {
                _id: id_command,
                owner: req.user._id.toString()
            }
        }
    });
    if (!ifMyItem) {
        return next(new AppError_1.AppError("Action not allowed", constants_1.httpCodes.forbidden));
    }
    // 3) Find command and update
    const modifiedCategory = yield categories_model_1.CategoriesModel.findOneAndUpdate({
        id_filter,
        'commands._id': id_command
    }, {
        $set: {
            'commands.$.command': command,
            'commands.$.en': en,
            'commands.$.es': es,
        }
    }, {
        new: true
    });
    if (!modifiedCategory) {
        return next(new AppError_1.AppError("Coomand not found", constants_1.httpCodes.not_found));
    }
    return res.json({
        status: "success",
        data: {
            ok: "ok"
        }
    });
}));
/**
* Delete command by id_filter and id_command
*/
exports.deleteCommand = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_filter, id_command } = req.params;
    // Validations
    if (!id_filter && !id_command) {
        return next(new AppError_1.AppError("id_filter and id_command don't exist. F1", constants_1.httpCodes.bad_request));
    }
    else {
        // 1) Check owner of item
        const ifMyItem = yield categories_model_1.CategoriesModel.findOne({
            'commands': {
                $elemMatch: {
                    _id: id_command,
                    owner: req.user._id.toString()
                }
            }
        });
        if (!ifMyItem) {
            return next(new AppError_1.AppError("Action not allowed", constants_1.httpCodes.forbidden));
        }
        // 2º Find category
        const found = yield categories_model_1.CategoriesModel.findById(id_filter);
        if (!found) {
            return next(new AppError_1.AppError("id_filter and id_command don't exist. F2", constants_1.httpCodes.bad_request));
        }
        if (found.commands.length === 0 || !found.commands.find(item => { var _a; return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) === id_command; })) {
            return next(new AppError_1.AppError("id_filter and id_command don't exist. F3", constants_1.httpCodes.bad_request));
        }
        yield categories_model_1.CategoriesModel.updateOne({ _id: id_filter }, {
            $pull: {
                commands: { _id: id_command }
            }
        });
        return res.json({
            status: "success",
            data: null
        });
    }
}));
///////////////////
// Useful functions
///////////////////
const populateInCommands = (command, lang, subCategoryQueryParam) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const subCategories = [];
    const select = lang ? `_id ${lang} color` : "_id color";
    if (((_a = command.subCategories) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        for (let i = 0; i < command.subCategories.length; i++) {
            const subCategory_id = command.subCategories[i];
            const foundSubCategories = yield subCategories_model_1.SubCategoriesModel.findById(subCategory_id).select(select);
            subCategories.push(foundSubCategories);
        }
    }
    return subCategories.map((e) => {
        const newE = JSON.parse(JSON.stringify(e));
        if (newE._id === subCategoryQueryParam) {
            return Object.assign(Object.assign({}, newE), { found: true });
        }
        else {
            return newE;
        }
    });
});
const getCommandsWithSubCategoriesById = (commandsFound, command, meaning, lang, newPage, total, limitPage, subcategory, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let result = [];
    // Loop in commands
    for (let i = 0; i < ((_b = commandsFound.commands) === null || _b === void 0 ? void 0 : _b.length); i++) {
        const element = commandsFound.commands[i];
        // Add category father
        element.categoryFather = {
            _id: commandsFound._id,
            category: commandsFound.category,
            version: commandsFound.version,
        };
        // Find without command && meaning
        if (!command && !meaning) {
            result = yield foundSubCategory(result, element, lang, subcategory);
            // Find by command or meaning and only one language
        }
        else if (command && meaning && lang && (element.command.toLowerCase().includes(command.toLowerCase()) ||
            element[lang].toLowerCase().includes(meaning.toLowerCase()))) {
            result = yield foundSubCategory(result, element, lang, subcategory);
            // Find by command or meaning and without language
        }
        else if (command && meaning && !lang && (element.command.toLowerCase().includes(command.toLowerCase()) ||
            element["en"].toLowerCase().includes(meaning.toLowerCase()) || element["es"].toLowerCase().includes(meaning.toLowerCase()))) {
            result = yield foundSubCategory(result, element, lang, subcategory);
            // Find only by command
        }
        else if (command && element.command.toLowerCase().includes(command.toLowerCase())) {
            result = yield foundSubCategory(result, element, lang, subcategory);
            // Find only by meaning and only one language
        }
        else if (meaning && lang && element[lang].toLowerCase().includes(meaning.toLowerCase())) {
            result = yield foundSubCategory(result, element, lang, subcategory);
            // Find only by meaning and without language
        }
        else if (meaning && !lang &&
            (element["en"].toLowerCase().includes(meaning.toLowerCase()) ||
                element["es"].toLowerCase().includes(meaning.toLowerCase()))) {
            result = yield foundSubCategory(result, element, lang, subcategory);
        }
    }
    // Pagination
    const newResult = result.slice((newPage - 1) * limitPage, (newPage - 1) * limitPage + limitPage);
    let pages = 1;
    // Parse info in case doesn’t exist results
    if (!newResult.length) {
        newPage = 0;
        total = 0;
    }
    else {
        total = result.length;
        pages = Math.ceil(total / limitPage);
    }
    return res.json({
        status: "success",
        total,
        resultsForPage: newResult.length,
        page: newPage,
        pages,
        limitPage,
        lang,
        data: newResult
    });
});
const getCommandsWithSubCategoriesByAllCategories = (commandsFound, command, meaning, lang, newPage, total, limitPage, subcategory, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let result = [];
    for (let i = 0; i < commandsFound.length; i++) {
        const item = commandsFound[i];
        // Loop in commands
        for (let j = 0; j < ((_c = item.commands) === null || _c === void 0 ? void 0 : _c.length); j++) {
            const element = item.commands[j];
            // Add category father
            element.categoryFather = {
                _id: item._id,
                category: item.category,
                version: item.version,
            };
            // Only find by category = all without queries
            if (!command && !meaning) {
                result = yield foundSubCategory(result, element, lang, subcategory);
                // Find by command or meaning and only one language
            }
            else if (command && meaning && lang && (element.command.toLowerCase().includes(command.toLowerCase()) ||
                element[lang].toLowerCase().includes(meaning.toLowerCase()))) {
                result = yield foundSubCategory(result, element, lang, subcategory);
                // Find by command or meaning and without language
            }
            else if (command && meaning && !lang && (element.command.toLowerCase().includes(command.toLowerCase()) ||
                element["en"].toLowerCase().includes(meaning.toLowerCase()) || element["es"].toLowerCase().includes(meaning.toLowerCase()))) {
                result = yield foundSubCategory(result, element, lang, subcategory);
                // Find only by command
            }
            else if (command && element.command.toLowerCase().includes(command.toLowerCase())) {
                result = yield foundSubCategory(result, element, lang, subcategory);
                // Find only by meaning and only one language
            }
            else if (meaning && lang && element[lang].toLowerCase().includes(meaning.toLowerCase())) {
                result = yield foundSubCategory(result, element, lang, subcategory);
                // Find only by meaning and without language
            }
            else if (meaning && !lang &&
                (element["en"].toLowerCase().includes(meaning.toLowerCase()) ||
                    element["es"].toLowerCase().includes(meaning.toLowerCase()))) {
                result = yield foundSubCategory(result, element, lang, subcategory);
            }
        }
    }
    // Pagination
    const newResult = result.slice((newPage - 1) * limitPage, (newPage - 1) * limitPage + limitPage);
    let pages = 1;
    // Parse info in case doesn’t exist results
    if (!newResult.length) {
        newPage = 0;
        total = 0;
    }
    else {
        total = result.length;
        pages = Math.ceil(total / limitPage);
    }
    return res.json({
        status: "success",
        total,
        resultsForPage: newResult.length,
        page: newPage,
        pages,
        limitPage,
        lang,
        data: newResult
    });
});
/**
 * Found subCategory and populate in commands
 * Furthermore, add info of category father
 */
const foundSubCategory = (result, element, lang, subcategory) => __awaiter(void 0, void 0, void 0, function* () {
    const populatedSubCategories = yield populateInCommands(element, lang, subcategory);
    if (subcategory) {
        if (populatedSubCategories.find(e => e.found)) {
            if (lang) {
                result.push({
                    command: element.command,
                    subCategories: populatedSubCategories,
                    updatedAt: element.updatedAt,
                    createdAt: element.createdAt,
                    language: element.language,
                    [lang]: element[lang],
                    categoryFather: element.categoryFather,
                    _id: element._id,
                    owner: element.owner
                });
            }
            else {
                result.push({
                    command: element.command,
                    subCategories: populatedSubCategories,
                    updatedAt: element.updatedAt,
                    createdAt: element.createdAt,
                    language: element.language,
                    en: element["en"],
                    es: element["es"],
                    categoryFather: element.categoryFather,
                    _id: element._id,
                    owner: element.owner
                });
            }
            return result;
        }
        else {
            return result;
        }
    }
    else {
        if (lang) {
            result.push({
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                createdAt: element.createdAt,
                language: element.language,
                [lang]: element[lang],
                categoryFather: element.categoryFather,
                _id: element._id,
                owner: element.owner
            });
        }
        else {
            result.push({
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                createdAt: element.createdAt,
                language: element.language,
                en: element["en"],
                es: element["es"],
                categoryFather: element.categoryFather,
                _id: element._id,
                owner: element.owner
            });
        }
        return result;
    }
});
//# sourceMappingURL=categories.controller.js.map