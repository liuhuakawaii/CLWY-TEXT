class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

/**
 * 成功响应
 */
function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * 分页成功响应
 */
function successWithPagination(res, message, data, pagination) {
  res.status(200).json({
    status: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  });
}

/**
 * 失败响应
 */
function failure(res, error) {
  let statusCode = 500;
  let message = error.message;
  let errors = [];

  // 根据错误类型设置响应
  if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = error.errors.map(e => e.message);
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    errors = error.errors || [];
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = error.message;
  } else if (error.statusCode) {
    statusCode = error.statusCode;
  }

  res.status(statusCode).json({
    status: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  success,
  successWithPagination,
  failure
};