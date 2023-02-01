export class AppError extends Error{
    statusCode;
    status;
    isOperational;
    constructor(message: any, statusCode: number) {
        super(message);
    
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    
        // Delete stack of error, not show all info about this error
        Error.captureStackTrace(this, this.constructor);
    }
}