const express = require('express');
const router = express.Router();
const ArticleService = require('../../services/articleService');
const { success, successWithPagination } = require('../../utils/response');
const { asyncHandler, paginationMiddleware, validateParams } = require('../../utils/middleware');

// 验证规则
const createArticleValidation = {
  title: { required: true, minLength: 2, maxLength: 30 },
  content: { required: true, minLength: 1, maxLength: 1000 }
};

const updateArticleValidation = {
  title: { minLength: 2, maxLength: 30 },
  content: { minLength: 1, maxLength: 1000 }
};

/**
 * 获取文章列表（支持搜索和分页）
 * GET /admin/articles?title=xxx&content=xxx&currentPage=1&pageSize=10
 */
router.get('/', paginationMiddleware, asyncHandler(async (req, res) => {
  const { title, content } = req.query;
  const { pagination } = req;

  const result = await ArticleService.getArticles({ title, content, pagination });

  successWithPagination(res, 'Articles fetched successfully', result.articles, result.pagination);
}));

/**
 * 获取单个文章
 * GET /admin/articles/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleService.getArticleById(id);

  success(res, 'Article fetched successfully', article);
}));

/**
 * 创建新文章
 * POST /admin/articles
 */
router.post('/', validateParams(createArticleValidation), asyncHandler(async (req, res) => {
  const article = await ArticleService.createArticle(req.body);

  success(res, 'Article created successfully', article, 201);
}));

/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put('/:id', validateParams(updateArticleValidation), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleService.updateArticle(id, req.body);

  success(res, 'Article updated successfully', article);
}));

/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ArticleService.deleteArticle(id);

  success(res, 'Article deleted successfully', null);
}));

module.exports = router;
