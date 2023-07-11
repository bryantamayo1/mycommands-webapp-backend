import { CategoriesModel } from "../categories/categories.model";
import { bodyIsEmpty, catchAsync } from "../utils/utils";
import { httpCodes } from '../utils/constants';
import { Request, Response, NextFunction } from "express";
import { AppError } from "../manage-errors/AppError";
import { updateCounterPage } from "../infoPage/infoPage.controller";

/**
 * Return the filters to search and count the access to web page
 * @returns Array with filters
 */
 export const findFilters = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const {lang} = req.params;
    
    // Validations
    if(!(lang === "en" || lang === "es")){
        return next(new AppError("Query lan can be 'en' or 'es'", httpCodes.bad_request));
    }

    const found = await CategoriesModel.find().populate("subCategories");
    let totalCommands = 0;
    // Building response
    const cleanData = found.map(item => {
        totalCommands+=item.commands.length;
        let subCategories = undefined;
        if(item.subCategories.length > 0){
            subCategories = item.subCategories.map( (e: any) => {
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
                [lang]: lang === "en"? "All" : "Todos",
                color: "pink",
                _id: "all",
                owner: 'everybody'
            })
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
        }
    });

    // Store category by defualt 'All'
    cleanData.unshift({
        category: lang === "en"? "All" : "Todas",
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
});

export const createFilter = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    // Validations
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
    }else if(!req.body.category || !req.body.version){
        return next(new AppError("Category and version are compulsories", httpCodes.bad_request));
    }

    const newFilter = await CategoriesModel.create({
        owner: req.user._id,
        ...req.body,
        commands: []    // By default commands is empty  
    });

    return res.status(httpCodes.created).json({
        status: "success",
        data: {
            category: newFilter.category,
            version: newFilter.version
        }
    })
});

/**
 * Update one filter by category and version
 */
export const modificateFilter = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {id_filter} = req.params;
    const {category, version} = req.body;
    let properties = {}

    // Validations
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
    }else if(!id_filter){
        return next(new AppError("Error E1", httpCodes.bad_request));
    }else if(category && version){
        properties = {category, version}
    }

    // Check owner of item
    const ifMyItem = await CategoriesModel.findOne({ _id: id_filter, owner: req.user._id.toString()});
    if(!ifMyItem){
        return next(new AppError("Action not allowed", httpCodes.forbidden));
    }

    const found = await CategoriesModel.findByIdAndUpdate(id_filter,
    {
        ...properties
    }, {
        new: true,
        runValidators : true
    });
    if(!found){
        return next(new AppError("Filter not found", httpCodes.not_found));
    }

    return res.json({
        status: "success",
        data: {
            category: found.category,
            version: found.version,
        }
    });
});

/**
 * Delete one filter by unique id
 */
export const deleteFilter = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {id_filter} = req.params;

    // Validations
    if(!id_filter){
        return next(new AppError("ID filter empty", httpCodes.bad_request));
    }

    // 1º Check owner of item
    const ifMyItem = await CategoriesModel.findOne({ _id: id_filter, owner: req.user._id.toString()});
    if(!ifMyItem){
        return next(new AppError("Action not allowed", httpCodes.forbidden));
    }

    // 2ª Delete filter
    const foundFilter = await CategoriesModel.deleteOne({ _id: id_filter });
    if(foundFilter.deletedCount !== 1){
        return next(new AppError("ID filter doesn't exist", httpCodes.not_found));
    }else{
        return res.json({
            status: "success",
            data: null
        });
    }
});