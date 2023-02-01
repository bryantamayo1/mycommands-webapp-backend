import { NextFunction, Request, Response } from "express";

/**
 * Hnadle errors in Express aplication
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // console.log(err.stack);        // View where is the error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }else{
        
    }
}

const sendErrorDev = (err: any, req: Request, res: Response) => {
    console.log("sendErrorDev")
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
}