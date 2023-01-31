import { CategoriesModel } from "../categories/categories.model";
import { bodyIsEmpty } from "../utils/utils";
import { httpCodes } from '../utils/constants';

/**
 * Only return the filters to search
 * @returns Array with filters
 */
 export const findFilters = async(req: any, res: any) => {
    const found = await CategoriesModel.find();

    const cleanData = found.map(item => ({
        category: item.category,
        version: item.version,
        _id: item._id
    }));
    return res.json(cleanData);
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createFilter = async(req: any, res: any) => {
    // Validations
    if(bodyIsEmpty(req.body)){
        return res.json({
            msg: "Debe introducir algún campo"
        });
    }
    const newFilter = await CategoriesModel.create({
        ...req.body,
        commands: []    // By default commands is empty  
    });

    return res.status(httpCodes.created).json({
        category: newFilter.category,
        version: newFilter.version
    })
}