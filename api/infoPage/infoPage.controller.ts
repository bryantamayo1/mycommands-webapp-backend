import { InfoPageModel } from "./infoPage.model";
import moment from 'moment';

/**
 * Get web page’s info
 * Get counter of web page
 */
export const updateCounterPage = async() => {
    const field = moment().format("MM-YYYY");
    const counter = `{
        "${field}": 1
    }`;
    const counterObject = JSON.parse(counter);
    // Increment in 1
    const res = await InfoPageModel.updateOne( {$inc: counterObject } );
    // In case that doesn''t exist date, then create a new date
    if(!res.matchedCount){
        await InfoPageModel.create(counterObject);
    }
}