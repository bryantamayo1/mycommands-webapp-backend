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