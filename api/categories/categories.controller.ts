import { httpCodes } from "../utils/constants";
import { CategoriesModel } from "./categories.model";

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
 * Find commands by command or info. Info can be in 'en' or 'es' 
 * Path:
 *      lang: [compulsory] 'en' or 'es'
 * Queryparams:
 *      category: [compulsory] with default 'all'
 *      commands
 */
export const searchCommands = async(req: any, res: any) => {
    const {category, command} = req.query;
    const {lang} = req.params;

    // Validations
    if(!category){
        return res.status(httpCodes.not_found).json({
            msg: "Not found"
        });
    }
    
    // If category = all
    let result: any[] = [];
    if(category === "all"){
        let found: any = await CategoriesModel.find();
        const commands = JSON.parse(JSON.stringify(found));
        // All in one buffer, is easer to work
        commands.map( (item: any) => {
            item.commands.map((element: any) => {
                if(element.command.includes(command)){
                    result.push(element);        
                }
            });
        });


    }   

    return res.json(result);
}