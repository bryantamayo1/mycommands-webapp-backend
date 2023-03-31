import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { AppError } from "../manage-errors/AppError";
import { UsersModel } from "../users/users.models";
import { httpCodes } from '../utils/constants';
import { catchAsync } from "../utils/utils";

/**
 * Check token of FE and getting info of user
 */
export const validateToken = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    // 1) Getting token
    let token = "";
    if(req.headers.xen && req.headers.xen.startsWith('Bearer')) {
      token = req.headers.xen.split(' ')[1];
    }

    if(!token){
        return next(new AppError("Need to login in application web", httpCodes.unauthorized));
    }

    // 2) Verification token
    // @ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.KEY_JWT);
    // @ts-ignore
    const currentUser = await UsersModel.findById(decoded.id);
    if(!currentUser){
        return next(new AppError("This user doesn't exit yet", httpCodes.bad_request));
    }

    // Store user to use next routes
    req.user = currentUser;
    next();
});