// Standardized wrapper for successful API responses
class ApiResponse {
  constructor(
    statusCode,             // HTTP status code (e.g. 200, 201)
    data,                  // The actual payload being returned to the client
    message = "Success!",  // Default success message if none provided
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;  // Convention: 2xx/3xx = success, 4xx/5xx = failure
  }
}

export default ApiResponse;