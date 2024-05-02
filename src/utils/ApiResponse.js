class ApiResponse {
  constructor(statusCode = 200, message = "Success", data, success = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}

export default ApiResponse;
