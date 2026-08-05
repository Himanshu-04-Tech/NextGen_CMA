/**
 * NextGen CMA — Standardized API Response
 *
 * Ensures a consistent response format across all API endpoints.
 */

export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} data - Response payload
   */
  constructor(statusCode, message, data = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Sends the response using the Express response object.
   * @param {import('express').Response} res - Express response
   * @returns {void}
   */
  send(res) {
    const responseBody = {
      success: this.success,
      message: this.message,
    };

    // Only include data if it exists
    if (this.data !== null && this.data !== undefined) {
      responseBody.data = this.data;
    }

    return res.status(this.statusCode).json(responseBody);
  }

  // ----- Factory Methods -----

  /**
   * 200 OK response.
   */
  static ok(message, data) {
    return new ApiResponse(200, message, data);
  }

  /**
   * 201 Created response.
   */
  static created(message, data) {
    return new ApiResponse(201, message, data);
  }
}
