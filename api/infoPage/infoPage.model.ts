import { model, Schema } from "mongoose";

/**
 * Store web page’s info. At the moment, only counter of web
 * Structure:
 *      {
 *          "03-2023": 3,
 *          "04-2023": 10,
 *          "05-2023": 100,
 *          ...
 *      }
 */
const infoPageSchema = new Schema({
    any: Schema.Types.Mixed 
}, {
    strict: false
});

const InfoPageModel = model("info_page", infoPageSchema);
export {InfoPageModel}