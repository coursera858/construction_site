
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.data = null;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError{
  constructor(message,errors){
    super(422,message)
    this.errors = errors.map(curEle => ({
      name : curEle.path[0],
      message : curEle.message
    }))
  }
}

export class NotFoundError extends ApiError{
  constructor(message){
    super(404,message)
  }
}

export class DuplicateError extends ApiError{
  constructor(field){
    super(409,`${field} already exists`)
    this.errors = [{
      name : field,
      message : `${field} already exists`
    }]
  }
}