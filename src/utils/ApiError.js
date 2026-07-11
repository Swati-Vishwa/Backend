// Custom error class to standardize API error responses across the app
class ApiError extends Error {
  constructor(
    statusCode,        
    message,          
    errors = [],        
    stacks = ""       
  ) {
    super(message);       // Call parent Error constructor to set this.message

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;    

    if (stacks) {
      this.stack = stacks;   
      // Auto-capture a clean stack trace, excluding the constructor call itself
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;