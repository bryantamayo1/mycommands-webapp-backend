"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.bodyIsEmpty = void 0;
/**
 * @param {Object} obj
 * @returns true = is empty, false is not empty
 */
const bodyIsEmpty = (obj) => {
    if (Object.keys(obj).length > 0) {
        return false;
    }
    else {
        return true;
    }
};
exports.bodyIsEmpty = bodyIsEmpty;
/**
 * It's used in each controller of application to
 * use handle error of Express.js
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=utils.js.map