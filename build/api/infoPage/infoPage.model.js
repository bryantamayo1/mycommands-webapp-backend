"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoPageModel = void 0;
const mongoose_1 = require("mongoose");
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
const infoPageSchema = new mongoose_1.Schema({
    any: mongoose_1.Schema.Types.Mixed
}, {
    strict: false
});
const InfoPageModel = (0, mongoose_1.model)("info_page", infoPageSchema);
exports.InfoPageModel = InfoPageModel;
//# sourceMappingURL=infoPage.model.js.map