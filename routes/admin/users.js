const express = require('express');
const router = express.Router();
const UserService = require('../../services/userService');
const { success, successWithPagination } = require('../../utils/response');
const { asyncHandler, paginationMiddleware, validateParams } = require('../../utils/middleware');

// 验证规则
const createUserValidation = {
  email: { required: true, minLength: 1, maxLength: 255 },
  username: { required: true, minLength: 1, maxLength: 255 },
  password: { required: true, minLength: 6, maxLength: 20 },
  nickname: { required: true, minLength: 2, maxLength: 10 }
};

const updateUserValidation = {
  email: { minLength: 1, maxLength: 255 },
  username: { minLength: 1, maxLength: 255 },
  password: { minLength: 6, maxLength: 20 },
  nickname: { minLength: 2, maxLength: 10 }
};

// 额外的验证函数
const validateUserData = (req, res, next) => {
  const { email, password, sex, role } = req.body;
  const errors = [];

  // 验证邮箱格式
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('请输入正确的邮箱地址');
    }
  }

  // 验证密码格式（如果提供了密码）
  if (password) {
    const passwordRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
    if (!passwordRegex.test(password)) {
      errors.push('密码必须以字母开头，长度为6-16个字符，只能包含字母、数字和下划线');
    }
  }

  // 验证性别
  if (sex !== undefined && ![0, 1, 2].includes(Number(sex))) {
    errors.push('性别必须是0、1、2');
  }

  // 验证角色
  if (role !== undefined && ![0, 100].includes(Number(role))) {
    errors.push('角色必须是0（普通用户）或100（管理员）');
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
 * 获取用户列表（支持搜索和分页）
 * GET /admin/users?email=xxx&username=xxx&nickname=xxx&role=xxx&currentPage=1&pageSize=10
 */
router.get('/', paginationMiddleware, asyncHandler(async (req, res) => {
  const { email, username, nickname, role } = req.query;
  const { pagination } = req;

  const result = await UserService.getUsers({
    email,
    username,
    nickname,
    role,
    pagination
  });

  successWithPagination(res, 'Users fetched successfully', result.users, result.pagination);
}));

/**
 * 获取单个用户
 * GET /admin/users/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.getUserById(id);

  success(res, 'User fetched successfully', user);
}));

/**
 * 创建新用户
 * POST /admin/users
 */
router.post('/',
  validateParams(createUserValidation),
  validateUserData,
  asyncHandler(async (req, res) => {
    const user = await UserService.createUser(req.body);

    success(res, 'User created successfully', user, 201);
  })
);

/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put('/:id',
  validateParams(updateUserValidation),
  validateUserData,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserService.updateUser(id, req.body);

    success(res, 'User updated successfully', user);
  })
);

/**
 * 删除用户
 * DELETE /admin/users/:id
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await UserService.deleteUser(id);

  success(res, 'User deleted successfully', null);
}));

module.exports = router; 