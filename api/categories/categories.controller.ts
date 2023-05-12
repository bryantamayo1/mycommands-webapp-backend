import e, { Request, Response, NextFunction } from "express";
import { AppError } from "../manage-errors/AppError";
import { SubCategoriesModel } from "../subCategories/subCategories.model";
import { httpCodes, languages } from '../utils/constants';
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
 *      subcategory: it's opcional, it has mongo’s id
 * Possiblities in queries
 *      ?category=any
 *      ?category=any&command=any
 *      ?category=any&meaning=any
 *      ?category=any&command=any&meaning=any
 *      ?category=any&command=any&meaning=any&subcategory
 */
export const searchCommands = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {category, command, meaning, page, subcategory} = req.query;
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
    
    // test
    let found_test: any = await CategoriesModel.findById(category);
    found_test.commands.forEach((element: any) => {
        element.language = "sql";
    });
    await found_test.save();
    console.log(found_test.commands)
    
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
            subcategory,
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
            subcategory,
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
 export const modificateCommand = catchAsync(async(req: any, res: Response, next: NextFunction) => {
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

    // 2) Find command and update
    const modifiedCategory = await CategoriesModel.findOneAndUpdate({
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
    if(!modifiedCategory){
        return next(new AppError("Coomand not found", httpCodes.not_found));
    }

    return res.json({
        status: "success",
        data: {
            ok: "ok"
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
const populateInCommands = async (command: any, lang: string, subCategoryQueryParam?: string) => {
    const subCategories = [];
    const select = `_id ${lang} color`;
    if(command.subCategories?.length > 0){
        for(let i = 0; i < command.subCategories.length; i++){
            const subCategory_id = command.subCategories[i];
            const foundSubCategories = await SubCategoriesModel.findById(subCategory_id).select(select);
            subCategories.push(foundSubCategories)
        }
    }
    return subCategories.map((e: any) => {
        const newE = JSON.parse(JSON.stringify(e));
        if(newE._id === subCategoryQueryParam){
            return {...newE, found: true}
        }else{
            return newE;
        }
    });
}

const getCommandsWithSubCategoriesById = async(
        commandsFound: any,
        command: string,
        meaning: string,
        lang: string,
        newPage: number,
        total: number,
        limitPage: number,
        subcategory: string,
        res: any
    ) => {
    let result: any = [];
    for( let i = 0; i < commandsFound.commands?.length; i++){
        const element = commandsFound.commands[i];

        // Find without command && meaning
        if(!command && !meaning){
            result = await foundSubCategory(result, element, lang, subcategory);
        
        // Find by command and meaning
        }else if ( command && meaning && (element.command.toLowerCase().includes( command.toLowerCase() ) ||
        element[lang].toLowerCase().includes( meaning.toLowerCase() ))){
            result = await foundSubCategory(result, element, lang, subcategory);
        
        // Find only by command
        }else if(command && element.command.toLowerCase().includes( command.toLowerCase() )){
            result = await foundSubCategory(result, element, lang, subcategory);
        
        // Find only by meaning
        }else if(meaning && element[lang].toLowerCase().includes( meaning.toLowerCase() )){
            result = await foundSubCategory(result, element, lang, subcategory);
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
        resultsForPage: newResult.length,
        page: newPage,
        limitPage,
        lang,
        data: newResult
    });
}

const getCommandsWithSubCategoriesByAllCategories = async(
        commandsFound: any,
        command: string,
        meaning: string,
        lang: string,
        newPage: number,
        total: number,
        limitPage: number,
        subcategory: string,
        res: any
    ) => {
    let result: any = [];
    for(let i = 0; i < commandsFound.length; i++){
        const item = commandsFound[i];
        for(let j = 0; j < item.commands.length; j++){
            const element = item.commands[j];

            // Only find by category = all without queries
            if(!command && !meaning){
                result = await foundSubCategory(result, element, lang, subcategory);
            
            // Find by command and meaning
            }else if ( command && meaning && (element.command.toLowerCase().includes( command.toLowerCase() ) ||
            element[lang].toLowerCase().includes( meaning.toLowerCase() ))){
                result = await foundSubCategory(result, element, lang, subcategory);
            
            // Find only by command
            }else if(command && element.command.toLowerCase().includes( command.toLowerCase() )){
                result = await foundSubCategory(result, element, lang, subcategory);
            
            // Find only by meaning
            }else if(meaning && element[lang].toLowerCase().includes( meaning.toLowerCase() )){
                result = await foundSubCategory(result, element, lang, subcategory); 
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
        resultsForPage: newResult.length,
        page: newPage,
        limitPage,
        lang,
        data: newResult
    });
}

/**
 * Found subCategory and populate in commands
 */
const foundSubCategory = async(result: any, element: any, lang: string, subcategory: string) => {
    const populatedSubCategories = await populateInCommands(element, lang, subcategory);
    if(subcategory){
        if(populatedSubCategories.find(e => e.found)){
            result.push({ 
                command: element.command,
                subCategories: populatedSubCategories,
                updatedAt: element.updatedAt,
                language: element.language,
                [lang]: element[lang],
                _id: element._id
            });  
            return result;
        }else{
            return result;
        }
    }else{
        result.push({ 
            command: element.command,
            subCategories: populatedSubCategories,
            language: element.language,
            updatedAt: element.updatedAt,
            [lang]: element[lang],
            _id: element._id
        });
        return result;  
    }
}