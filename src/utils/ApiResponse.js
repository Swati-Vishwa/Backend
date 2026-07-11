// Standardized wrapper for successful API responses
class ApiResponse {
  constructor(
    message = "Success!",  // Default success message if none provided
    data,                  // The actual payload being returned to the client
    statusCode              // HTTP status code (e.g. 200, 201)
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;  // Convention: 2xx/3xx = success, 4xx/5xx = failure
  }
}

export default ApiResponse;