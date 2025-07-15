const { failure } = require('./response');

/**
 * 异步路由错误处理中间件
 * 用法：router.get('/', asyncHandler(async (req, res) => {...}))
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 统一错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', err);
  failure(res, err);
};

/**
 * 分页参数验证中间件
 */
const paginationMiddleware = (req, res, next) => {
  const currentPage = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // 限制页面大小，防止恶意请求
  req.pagination = {
    currentPage: Math.max(1, currentPage),
    pageSize: Math.min(Math.max(1, pageSize), 100),
  };

  next();
};

/**
 * 参数验证中间件生成器
 */
const validateParams = (validationRules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(validationRules)) {
      const value = req.body[field] || req.query[field] || req.params[field];

      if (rules.required && (!value || value.trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = {
  asyncHandler,
  errorHandler,
  paginationMiddleware,
  validateParams
}; 