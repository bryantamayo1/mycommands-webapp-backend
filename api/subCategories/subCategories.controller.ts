import { NextFunction, Response }       from "express";
import { CategoriesModel }              from "../categories/categories.model";
import { AppError }                     from "../manage-errors/AppError";
import { httpCodes }                    from "../utils/constants";
import { bodyIsEmpty, catchAsync }      from "../utils/utils";
import { SubCategoriesModel }           from "./subCategories.model";

export const createCategory = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {id_category} = req.params;

    // Validations
    if(!id_category){
        return next(new AppError("This category doesn’t exist", httpCodes.bad_request));
    }
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
    }
    
    const foundCategory = await CategoriesModel.findById(id_category);
    if(!foundCategory){
        return next(new AppError("This category doesn’t exist", httpCodes.bad_request));
    }

    // POST
    const created = await SubCategoriesModel.create({
        owner: req.user._id,
        ...req.body
    });
    foundCategory.subCategories.push(created._id);
    await foundCategory.save();
    return res.json(req.body);
});