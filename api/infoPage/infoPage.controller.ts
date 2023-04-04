import { InfoPageModel } from "./infoPage.model";
import moment from 'moment';
import { catchAsync } from "../utils/utils";
import { Response } from "express";

/**
 * Get web page’s info
 * Update counter of web page for each month individually
 */
export const updateCounterPage = catchAsync(async(req: any, res: Response) => {
    const field = moment().format("MM-YYYY");
    const counter = `{
        "${field}": 1
    }`;
    const counterObject = JSON.parse(counter);
    // Increment in 1
    const result = await InfoPageModel.updateOne( {$inc: counterObject } );
    // In case that doesn''t exist date, then create a new date
    if(!result.matchedCount){
        await InfoPageModel.create(counterObject);
        return res.json({
            status: "success"
        });
    }else{
        return res.json({
            status: "success"
        });
    }
});