import { bodyIsEmpty, catchAsync } from "../utils/utils";
import { UsersModel } from "./users.models";
import { httpCodes } from '../utils/constants';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { AppError } from "../manage-errors/AppError";
import { NextFunction } from "express";

export const login = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const {email, password} = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError("Email or password are missing", httpCodes.bad_request));
    }
    
    // 2) Check if user exists && password are corrects
    const user = await UsersModel.findOne({ email }).select("+password -createdAt -updatedAt");
    if(!user || !(await user.checkPassword(password, user.password))) {
        return next(new AppError("Email or password aren't right", httpCodes.bad_request));
    }

    // 3) Create token
    // @ts-ignore
    const token = await promisify(jwt.sign)({id: user.id}, process.env.KEY_JWT!, {expiresIn: process.env.EXPIRE_TIME_JWT});
    const newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    delete newUser._id;

    return res.json({
        status: "success",
        data: {
            ...newUser,
            xen: token
        }
    });
});

export const register = catchAsync(async(req: any, res: any, next: any) => {
    const {userName, email, password, passwordConfirm} = req.body;
    
    // Validations
    if(bodyIsEmpty(req.body)){
        return next(new AppError("Body is empty", httpCodes.bad_request));
    }

    // Check password of FE
    if(password !== passwordConfirm){
        return next(new AppError("Passwords aren't the same", httpCodes.bad_request));
    }

    // Find email or userName exists already on BE
    const userExists = await UsersModel.find({ $or: [{userName}, {email}] });
    if(userExists.length > 0){
        return next(new AppError("User or email exists yet", httpCodes.bad_request));
    }

    // Create new user
    const newUser = await UsersModel.create({
        userName,
        email,
        password,
        passwordConfirm
    });
    return res.status(httpCodes.created).json({
        status: "success",
    });
});