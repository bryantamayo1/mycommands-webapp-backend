/**
 * @param {Object} obj 
 * @returns true = is empty, false is not empty
 */
 export const bodyIsEmpty = (obj: any) => {
    if(Object.keys(obj).length > 0){
        return false;
    }else{
        return true;
    }
}

/**
 * It's used in each controller of application to
 * use handle error of Express.js
 */
export const catchAsync = (fn: any) => {
    return (req: any, res: any, next: any) => {
        fn(req, res, next).catch(next);
    };
}

