class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}


function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data
  });
}

function failure(res, error) {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message);
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors
    });
  }
  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      status: false,
      message: [error.message],
      data: null
    });
  }
  res.status(500).json({
    status: false,
    message: [error.message],
    data: null
  });
}

module.exports = {
  NotFoundError,
  success,
  failure
}