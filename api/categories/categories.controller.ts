import { Request, Response, NextFunction } from "express";
import { AppError } from "../manage-errors/AppError";
import { SubCategoriesModel } from "../subCategories/subCategories.model";
import { httpCodes } from "../utils/constants";
import { bodyIsEmpty, catchAsync } from "../utils/utils";
import { CategoriesModel } from "./categories.model";

/**
 * Find commands by command, lang or meaning. Lang can be in 'en' or 'es' with pagination.
 * Having in consideration upper and lower case 
 * Path:
 *      lang: [compulsory] 'en' or 'es'
 * Queryparams:
 *      category: [compulsory] with default 'all'. It must be id of MongoDB or 'all'
 *      commands: it's opcional and it can't be ""
 *      meaning: it's opcional and it can't be ""
 * Possiblities in queries
 *      ?category=any
 *      ?category=any&command=any
 *      ?category=any&meaning=any
 *      ?category=any&command=any&meaning=any
 */
export const searchCommands = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {category, command, meaning, page} = req.query;
    let newPage = +page || 1;
    let total = 0;
    const limitPage = 20;
    const {lang} = req.params;

    // Validations
    if(!category || command === "" || meaning === ""){
        return next(new AppError("Error queries", httpCodes.bad_request));
    }
    if(!(lang === "en" || lang === "es")){
        return next(new AppError("Query lan can be 'en' or 'es'", httpCodes.bad_request));
    }
    
    let result: any[] = [];
    // 1º Case
    // If category = all
    if(category === "all"){
        let found = await CategoriesModel.find();
        const commandsFound = JSON.parse(JSON.stringify(found));
        return getCommandsWithSubCategoriesByAllCategories(
            commandsFound,
            command,
            meaning,
            lang,
            newPage,
            total,
            limitPage,
            res
        );

    // 2º Case
    }else{
        let found: any = await CategoriesModel.findById(category);
        const commandsFound = JSON.parse(JSON.stringify(found));

        // All in one buffer, is easer to work
        return getCommandsWithSubCategoriesById(
            commandsFound,
            command,
            meaning,
            lang,
            newPage,
            total,
            limitPage,
            res
        ); 
    }
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
  
///////////////////
// Useful functions
///////////////////
const populateInCommands = async (command: any, lang: string) => {
    const subCategories = [];
    const select = `_id ${lang}`;
    if(command.subCategories?.length > 0){
        for(let i = 0; i < command.subCategories.length; i++){
            const foundSubCategories = await SubCategoriesModel.findById(command.subCategories[i]).select(select);
            subCategories.push(foundSubCategories)
        }
    }
    return subCategories;
}

const getCommandsWithSubCategoriesById = async(commandsFound: any, command: string, meaning: string, lang: string, newPage: number, total: number, limitPage: number, res: any) => {
    const result: any = [];
    for( let i = 0; i < commandsFound.commands?.length; i++){
        const element = commandsFound.commands[i];
        // Only find by category = all without queries
        if(!command && !meaning){
            const populatedSubCategories = await populateInCommands(element, lang);
            result.push({ 
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                [lang]: element[lang],
                _id: element._id
            });  
        
        // Find by command and meaning
        }else if ( command && meaning && (element.command.toLowerCase().includes( command.toLowerCase() ) ||
        element[lang].toLowerCase().includes( meaning.toLowerCase() ))){
            const populatedSubCategories = await populateInCommands(element, lang);
            result.push({ 
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                [lang]: element[lang],
                _id: element._id
            });  
        
        // Find only by command
        }else if(command && element.command.toLowerCase().includes( command.toLowerCase() )){
            const populatedSubCategories = await populateInCommands(element, lang);
            result.push({ 
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                [lang]: element[lang],
                _id: element._id
            });  
        
        // Find only by meaning
        }else if(meaning && element[lang].toLowerCase().includes( meaning.toLowerCase() )){
            const populatedSubCategories = await populateInCommands(element, lang);
            result.push({ 
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                [lang]: element[lang],
                _id: element._id
            });  
        }
    }

    // Pagination
    const newResult = result.slice( (newPage - 1) * limitPage, (newPage - 1) * limitPage + limitPage );
    // Parse info in case doesn’t exist results
    if(!newResult.length){
        newPage = 0;
        total = 0;
    }else{
        total = result.length;
    }

    return res.json({
        status: "success",
        total,
        results: newResult.length,
        page: newPage,
        limitPage,
        lang,
        data: newResult
    });
}

const getCommandsWithSubCategoriesByAllCategories = async(commandsFound: any, command: string, meaning: string, lang: string, newPage: number, total: number, limitPage: number, res: any) => {
    const result: any = [];
    for(let i = 0; i < commandsFound.length; i++){
        const item = commandsFound[i];
        for(let j = 0; j < item.commands.length; j++){
            const element = item.commands[j];
            // Only find by category = all without queries
            if(!command && !meaning){
                const populatedSubCategories = await populateInCommands(element, lang);
                result.push({ 
                    command: element.command,
                    subCategories: populatedSubCategories,
                    updatedAt: element.updatedAt,
                    [lang]: element[lang],
                    _id: element._id
                });  
            
            // Find by command and meaning
            }else if ( command && meaning && (element.command.toLowerCase().includes( command.toLowerCase() ) ||
            element[lang].toLowerCase().includes( meaning.toLowerCase() ))){
                const populatedSubCategories = await populateInCommands(element, lang);
                result.push({ 
                    command: element.command,
                    subCategories: populatedSubCategories,
                    updatedAt: element.updatedAt,
                    [lang]: element[lang],
                    _id: element._id
                });  
            
            // Find only by command
            }else if(command && element.command.toLowerCase().includes( command.toLowerCase() )){
                const populatedSubCategories = await populateInCommands(element, lang);
                result.push({ 
                    command: element.command,
                    subCategories: populatedSubCategories,
                    updatedAt: element.updatedAt,
                    [lang]: element[lang],
                    _id: element._id
                });  
            
            // Find only by meaning
            }else if(meaning && element[lang].toLowerCase().includes( meaning.toLowerCase() )){
                const populatedSubCategories = await populateInCommands(element, lang);
                result.push({ 
                    command: element.command,
                    subCategories: populatedSubCategories,
                    updatedAt: element.updatedAt,
                    [lang]: element[lang],
                    _id: element._id
                });  
            }
        }
    }


    // Pagination
    const newResult = result.slice( (newPage - 1) * limitPage, (newPage - 1) * limitPage + limitPage );
    // Parse info in case doesn’t exist results
    if(!newResult.length){
        newPage = 0;
        total = 0;
    }else{
        total = result.length;
    }

    return res.json({
        status: "success",
        total,
        results: newResult.length,
        page: newPage,
        limitPage,
        lang,
        data: newResult
    });
}