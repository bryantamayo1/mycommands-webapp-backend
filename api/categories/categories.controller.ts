import { httpCodes } from "../utils/constants";
import { bodyIsEmpty } from "../utils/utils";
import { CategoriesModel } from "./categories.model";

/**
 * Find commands by command, lang or meaning. Lang can be in 'en' or 'es'.
 * Having in consideration upper and lower case 
 * Path:
 *      lang: [compulsory] 'en' or 'es'
 * Queryparams:
 *      category: [compulsory] with default 'all'. It must be id of MongoDB
 *      commands
 *      meaning
 */
export const searchCommands = async(req: any, res: any) => {
    const {category, command, meaning} = req.query;
    const {lang} = req.params;

    // Validations
    if(!category){
        return res.status(httpCodes.not_found).json({
            msg: "Not found"
        });
    }
    if(!(lang === "en" || lang === "es")){
        return res.status(httpCodes.not_found).json({
            msg: "Not found"
        });
    }
    
    let result: any[] = [];
    // 1º Case
    // If category = all
    if(category === "all"){
        let found: any = await CategoriesModel.find();
        const commands = JSON.parse(JSON.stringify(found));
        // All in one buffer, is easer to work
        commands.map( (item: any) => {
            item.commands?.map((element: any) => {
                // Find by query command or meaning
                if(element.command.toLowerCase().includes( command.toLowerCase() ) ||
                element[lang].toLowerCase().includes( meaning.toLowerCase() )){
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
            // Find by query command or meaning
            console.log("element: ", element)
            if(element.command.toLowerCase().includes( command.toLowerCase() ) ||
            element[lang].toLowerCase().includes( meaning.toLowerCase() )){
                result.push({ 
                    command: element.command,
                    [lang]: element[lang]
                });        
            }
        });
    }  

    return res.json(result);
}

/**
 * Create command by id of filters
 */
export const createCommand = async(req: any, res: any) => {
    const {id_filter} = req.params;
    console.log(id_filter);
    console.log(req.body);

    // Validations
    if(bodyIsEmpty(req.body)){
        return res.json({
            msg: "Debe introducir algún campo"
        });
    }

    // Update
    CategoriesModel.findByIdAndUpdate(id_filter,
        {
            $push: {
                "commands": req.body
            }
        },{
            new: true
        }, (error, sucess) => {
            if(error){
                console.log("My error: ", error)
            }else{
                console.log(sucess)
            }
        }
    );

    return res.json({
        msg: "456"
    })

}