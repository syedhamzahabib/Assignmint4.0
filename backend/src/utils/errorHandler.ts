import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
  });
};
