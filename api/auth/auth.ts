import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { UsersModel } from "../users/users.models";
import { httpCodes } from '../utils/constants';

/**
 * Check token of FE and getting info of user
 */
export const validateToken = async(req: any, res: Response, next: NextFunction) => {
    // 1) Getting token
    let token = "";
    if(req.headers.xen && req.headers.xen.startsWith('Bearer')) {
      token = req.headers.xen.split(' ')[1];
    }

    if(!token){
        return res.status(httpCodes.unauthorized).json({
            status: "fail",
            msg: "Need to login in application web"
        });
    }

    // 2) Verification token
    // @ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.KEY_JWT);
    // @ts-ignore
    const currentUser = await UsersModel.findById(decoded.id);
    if(!currentUser){
        return res.status(httpCodes.bad_request).json({
            status: "fail",
            msg: "This user doesn't exit yet",
        })
    }

    req.user = currentUser
    next();
}