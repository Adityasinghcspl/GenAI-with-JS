import constants from "../constants.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // If headers are already sent, pass to the default Express error handler
  }
  // Default to 500 if no status code is set
  const statusCode = res.statusCode || 500;
  // Error response structure
  const errorResponse = {
    title: "",
    message: err.message || "An unexpected error occurred",
    // stackTrace: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  };
  // case for the error code
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      errorResponse.title = "Validation Failed";
      res.status(statusCode).json(errorResponse);
      break;
    case constants.NOT_FOUND:
      errorResponse.title = "Not Found";
      res.status(statusCode).json(errorResponse);
      break;
    case constants.UNAUTHORIZED:
      errorResponse.title = "Unauthorized";
      res.status(statusCode).json(errorResponse);
      break;
    case constants.FORBIDDEN:
      errorResponse.title = "Forbidden";
      res.status(statusCode).json(errorResponse);
      break;
    case constants.SERVER_ERROR:
      errorResponse.title = "Server Error";
      res.status(statusCode).json(errorResponse);
      break;
    default:
      errorResponse.title = "Error";
      res.status(statusCode).json(errorResponse);
      break;
  }
};

export default errorHandler;
