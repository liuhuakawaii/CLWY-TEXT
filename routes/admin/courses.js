const express = require('express');
const router = express.Router();
const CourseService = require('../../services/courseService');
const { success, successWithPagination } = require('../../utils/response');
const { asyncHandler, paginationMiddleware, validateParams } = require('../../utils/middleware');

// 验证规则
const createCourseValidation = {
  categoryId: { required: true },
  userId: { required: true },
  title: { required: true, minLength: 1, maxLength: 255 }
};

const updateCourseValidation = {
  title: { minLength: 1, maxLength: 255 }
};

// 额外的验证函数
const validateCourseData = (req, res, next) => {
  const { categoryId, userId, recommended, likesCount, chaptersCount } = req.body;
  const errors = [];

  // 验证分类ID
  if (categoryId && (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0)) {
    errors.push('分类ID必须是正整数');
  }

  // 验证用户ID
  if (userId && (!Number.isInteger(Number(userId)) || Number(userId) <= 0)) {
    errors.push('用户ID必须是正整数');
  }

  // 验证推荐状态
  if (recommended !== undefined && typeof recommended !== 'boolean') {
    errors.push('推荐状态必须是布尔值');
  }

  // 验证点赞数
  if (likesCount !== undefined && (!Number.isInteger(Number(likesCount)) || Number(likesCount) < 0)) {
    errors.push('点赞数必须是非负整数');
  }

  // 验证章节数
  if (chaptersCount !== undefined && (!Number.isInteger(Number(chaptersCount)) || Number(chaptersCount) < 0)) {
    errors.push('章节数必须是非负整数');
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

/**
 * 获取课程列表（支持搜索和分页）
 * GET /admin/courses?title=xxx&categoryId=xxx&userId=xxx&recommended=xxx&currentPage=1&pageSize=10
 */
router.get('/', paginationMiddleware, asyncHandler(async (req, res) => {
  const { title, categoryId, userId, recommended } = req.query;
  const { pagination } = req;

  const result = await CourseService.getCourses({
    title,
    categoryId,
    userId,
    recommended,
    pagination
  });

  successWithPagination(res, 'Courses fetched successfully', result.courses, result.pagination);
}));

/**
 * 获取推荐课程
 * GET /admin/courses/recommended
 */
router.get('/recommended', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const courses = await CourseService.getRecommendedCourses(Number(limit));

  success(res, 'Recommended courses fetched successfully', courses);
}));

/**
 * 根据分类获取课程
 * GET /admin/courses/category/:categoryId
 */
router.get('/category/:categoryId', paginationMiddleware, asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { pagination } = req;

  const result = await CourseService.getCoursesByCategory(categoryId, pagination);

  successWithPagination(res, 'Courses by category fetched successfully', result.courses, result.pagination);
}));

/**
 * 获取单个课程
 * GET /admin/courses/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await CourseService.getCourseById(id);

  success(res, 'Course fetched successfully', course);
}));

/**
 * 创建新课程
 * POST /admin/courses
 */
router.post('/',
  validateParams(createCourseValidation),
  validateCourseData,
  asyncHandler(async (req, res) => {
    const course = await CourseService.createCourse(req.body);

    success(res, 'Course created successfully', course, 201);
  })
);

/**
 * 更新课程
 * PUT /admin/courses/:id
 */
router.put('/:id',
  validateParams(updateCourseValidation),
  validateCourseData,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await CourseService.updateCourse(id, req.body);

    success(res, 'Course updated successfully', course);
  })
);

/**
 * 删除课程
 * DELETE /admin/courses/:id
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await CourseService.deleteCourse(id);

  success(res, 'Course deleted successfully', null);
}));

module.exports = router; 