/**
 * 应用常量配置
 */

// HTTP 状态码
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 分页配置
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

// 文章相关常量
const ARTICLE = {
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 30,
  CONTENT_MIN_LENGTH: 1,
  CONTENT_MAX_LENGTH: 1000,
  ALLOWED_FIELDS: ['title', 'content']
};

// 响应消息
const MESSAGES = {
  ARTICLE: {
    FETCHED: 'Articles fetched successfully',
    CREATED: 'Article created successfully',
    UPDATED: 'Article updated successfully',
    DELETED: 'Article deleted successfully',
    NOT_FOUND: 'Article not found'
  },
  VALIDATION: {
    FAILED: 'Validation failed',
    REQUIRED: (field) => `${field} is required`,
    MIN_LENGTH: (field, length) => `${field} must be at least ${length} characters`,
    MAX_LENGTH: (field, length) => `${field} must not exceed ${length} characters`
  },
  ERROR: {
    ROUTE_NOT_FOUND: 'Route not found',
    INTERNAL_ERROR: 'Internal server error'
  }
};

module.exports = {
  HTTP_STATUS,
  PAGINATION,
  ARTICLE,
  MESSAGES
}; 