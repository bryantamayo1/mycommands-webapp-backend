import { Request, Response, NextFunction } from "express";
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
export const searchCommands = catchAsync(async(req: any, res: Response, next: NextFunction) => {
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
        total: result.length,
        results: newResult.length,
        data: newResult
    });
});

/**
 * Create command by id of filters
 */
export const createCommand = catchAsync(async(req: any, res: Response, next: NextFunction) => {
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

/**
 * Modificate command by id of filters
 */
 export const modificateCommand = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const {id_filter, id_command} = req.params;
    const {command, en, es} = req.body;

    // Validations
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
    }

    // Steps to modificate one command
    // 1) Find filter
    const foundFilter = await CategoriesModel.findById(id_filter);
    if(!foundFilter){
        return next(new AppError("Filter not found", httpCodes.not_found));
    }
    // 2) Find command
    let commandFound: any = null;
    foundFilter.commands?.forEach(item => {
        // 3) Update one command
        if(item._id?.toString() === id_command){
            item.command = command? command : item.command;
            item.en = en? en : item.en;
            item.es = es? es : item.es;
            commandFound = item;
            return;
        }
    });

    // 4) Command not found 
    if(!commandFound){
        return next(new AppError("Command not found", httpCodes.not_found));
    }
    // 5) Save command
    await foundFilter.save();
    // 6) Cean data
    const commandModified = JSON.parse(JSON.stringify(commandFound));
    delete commandModified.createdAt;
    delete commandModified.updatedAt;

    return res.json({
        status: "success",
        data: {
            ...commandModified
        }
    });
 });

 /**
 * Delete command by id_filter and id_command
 */
  export const deleteCommand = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const {id_filter, id_command} = req.params;
    // Validations
    if(!id_filter && !id_command){
        return next(new AppError("id_filter and id_command don't exist", httpCodes.bad_request));   
    }else{
        // Steps to delete one command
        // 1) Find filter
        const foundFilter = await CategoriesModel.findById(id_filter);
        if(!foundFilter){
            return next(new AppError("Filter not found", httpCodes.not_found));
        }

        // 2) Find command
        let indexCmmandFound: any = -1;
        indexCmmandFound = foundFilter.commands?.findIndex((item: any) => item._id?.toString() === id_command);

        // 3) Command not found 
        if(indexCmmandFound === -1){
            return next(new AppError("Command not found", httpCodes.not_found));
        }

        // 4) Delete command
        foundFilter.commands.splice(indexCmmandFound, indexCmmandFound);

        // 5) Save command
        await foundFilter.save();
        return res.json({
            status: "success",
            data: null
        });
    }
  });