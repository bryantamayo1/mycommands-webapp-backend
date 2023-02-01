import { CategoriesModel } from "../categories/categories.model";
import { bodyIsEmpty, catchAsync } from "../utils/utils";
import { httpCodes } from '../utils/constants';
import { NextFunction } from "express";
import { AppError } from "../manage-errors/AppError";

/**
 * Only return the filters to search
 * @returns Array with filters
 */
 export const findFilters = catchAsync(async(req: any, res: any) => {
    const found = await CategoriesModel.find();
    const cleanData = found.map(item => ({
        category: item.category,
        version: item.version,
        _id: item._id
    }));
    return res.json({
        status: "success",
        results: cleanData.length,
        cdata: cleanData
    });
});

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createFilter = catchAsync(async(req: any, res: any, next: NextFunction) => {
    // Validations
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
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