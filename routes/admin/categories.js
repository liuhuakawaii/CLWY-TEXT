const express = require('express');
const router = express.Router();
const CategoryService = require('../../services/categoryService');
const { success, successWithPagination } = require('../../utils/response');
const { asyncHandler, paginationMiddleware, validateParams } = require('../../utils/middleware');

// 验证规则
const createCategoryValidation = {
  name: { required: true, minLength: 2, maxLength: 45 },
  rang: { required: true }
};

const updateCategoryValidation = {
  name: { minLength: 2, maxLength: 45 }
};

/**
 * 获取分类列表（支持搜索和分页）
 * GET /admin/categories?name=xxx&currentPage=1&pageSize=10
 */
router.get('/', paginationMiddleware, asyncHandler(async (req, res) => {
  const { name } = req.query;
  const { pagination } = req;

  const result = await CategoryService.getCategories({ name, pagination });

  successWithPagination(res, 'Categories fetched successfully', result.categories, result.pagination);
}));

/**
 * 获取单个分类
 * GET /admin/categories/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryService.getCategoryById(id);

  success(res, 'Category fetched successfully', category);
}));

/**
 * 创建新分类
 * POST /admin/categories
 */
router.post('/', validateParams(createCategoryValidation), asyncHandler(async (req, res) => {
  // 验证rang字段必须是正整数
  const { rang } = req.body;
  if (rang && (!Number.isInteger(Number(rang)) || Number(rang) <= 0)) {
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors: ['rang must be a positive integer']
    });
  }

  const category = await CategoryService.createCategory(req.body);

  success(res, 'Category created successfully', category, 201);
}));

/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put('/:id', validateParams(updateCategoryValidation), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 验证rang字段必须是正整数（如果提供的话）
  const { rang } = req.body;
  if (rang && (!Number.isInteger(Number(rang)) || Number(rang) <= 0)) {
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors: ['rang must be a positive integer']
    });
  }

  const category = await CategoryService.updateCategory(id, req.body);

  success(res, 'Category updated successfully', category);
}));

/**
 * 删除分类
 * DELETE /admin/categories/:id
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await CategoryService.deleteCategory(id);

  success(res, 'Category deleted successfully', null);
}));

module.exports = router;
