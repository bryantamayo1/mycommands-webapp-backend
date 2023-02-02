import { NextFunction } from "express";
import { AppError } from "../manage-errors/AppError";
import { httpCodes } from "../utils/constants";
import { bodyIsEmpty, catchAsync } from "../utils/utils";
import { CategoriesModel } from "./categories.model";

/**
 * Find commands by command, lang or meaning. Lang can be in 'en' or 'es' with pagination.
 * Having in consideration upper and lower case 
 * Path:
 *      lang: [compulsory] 'en' or 'es'
 * Queryparams:
 *      category: [compulsory] with default 'all'. It must be id of MongoDB
 *      commands
 *      meaning
 */
export const searchCommands = catchAsync(async(req: any, res: any, next: NextFunction) => {
    const {category, command, meaning, page} = req.query;
    const newPage = +page || 1;
    const limitPage = 20;
    const {lang} = req.params;

    // Validations
    if(!category){
        return next(new AppError("Query category is compulsory", httpCodes.bad_request));
    }
    if(!(lang === "en" || lang === "es")){
        return next(new AppError("Query lan can be 'en' or 'es'", httpCodes.bad_request));
    }
    
    let result: any[] = [];
    // 1º Case
    // If category = all
    if(category === "all"){
        let found = await CategoriesModel.find();
        const commands = JSON.parse(JSON.stringify(found));

        // All in one buffer, is easer to work
        commands.map( (item: any) => {
            item.commands?.map((element: any) => {
                // Only find by category = all
                if(!command && !meaning){
                    result.push({ 
                        command: element.command,
                        [lang]: element[lang]
                    });        

                // Find by query command or meaning
                }else if (element.command.toLowerCase().includes( command?.toLowerCase() ) ||
                element[lang].toLowerCase().includes( meaning?.toLowerCase() )){
                    result.push({ 
                        command: element.command,
                        [lang]: element[lang]
                    });        
                }
            });
        });

    // 2º Case
    }else{
        let found: any = await CategoriesModel.findById(category);
        const commands = JSON.parse(JSON.stringify(found));

        // All in one buffer, is easer to work
        commands.commands?.map((element: any) => {
            // Only find without queries
            if(!command && !meaning){
                result.push({ 
                    command: element.command,
                    [lang]: element[lang]
                });   

            // Find by query command or meaning
            }else if(element.command.toLowerCase().includes( command?.toLowerCase() ) ||
            element[lang].toLowerCase().includes( meaning?.toLowerCase() )){
                result.push({ 
                    command: element.command,
                    [lang]: element[lang]
                });        
            }
        });
    }

    // Pagination
    const newResult = result.slice( (newPage - 1) * limitPage, (newPage - 1) * limitPage + limitPage );

    return res.json({
        status: "success",
        results: newResult.length,
        data: newResult
    });
});

/**
 * Create command by id of filters
 */
export const createCommand = catchAsync(async(req: any, res: any, next: NextFunction) => {
    const {id_filter} = req.params;

    // Validations
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
    }

    // Update
    const found = await CategoriesModel.findByIdAndUpdate(id_filter,
    {
        $push: {
            commands: {
                owner: req.user._id,
                ...req.body
            },
        }
    },{
        new: true,
        runValidators : true
    });
    if(!found){
        return next(new AppError("Filter not found", httpCodes.not_found));
    }

    return res.status(httpCodes.created).json({
        status: "success"
    });
});