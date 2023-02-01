import { bodyIsEmpty } from "../utils/utils";
import { UsersModel } from "./users.models";
import { httpCodes } from '../utils/constants';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

export const login = async (req: any, res: any) => {
    const {email, password} = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return res.status(httpCodes.bad_request).json({
            status: "fail",
            msg: "Email or password are missing"
        });
    }
    
    // 2) Check if user exists && password are corrects
    const user = await UsersModel.findOne({ email }).select("+password -createdAt -updatedAt");
    if(!user || !(await user.checkPassword(password, user.password))) {
        return res.status(httpCodes.bad_request).json({
            status: "fail",
            msg: "Email or password aren't right"
        });
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
}

export const register = async (req: any, res: any) => {
    const {userName, email, password, passwordConfirm} = req.body;
    
    // Validations
    if(bodyIsEmpty(req.body)){
        return res.status(httpCodes.bad_request).json({
            status: "fail",
            msg: "Body is empty"
        });
    }

    // Check password of FE
    if(password !== passwordConfirm){
        return res.status(httpCodes.bad_request).json({
            msg: "Passwords aren't the same"
        });
    }

    // Find email or userName exists already on BE
    const userExists = await UsersModel.find({ $or: [{userName}, {email}] });
    if(userExists.length > 0){
        return res.status(httpCodes.bad_request).json({
            status: "fail",
            msg: "User or email exists yet"
        });
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
}