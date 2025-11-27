class ApiError extends Error {
    constructor(
        statusCode,
        message ="something went wrong",
        errors = [],
    
    ){
        super(message);
        this.statusCode =statusCode;
        this.errors = errors;
        this.success = false;
        Error.captureStackTrace(this , this.constructor);
        
    }
}

export {ApiError}