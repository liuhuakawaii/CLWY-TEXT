const { User } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../utils/response');

class UserService {
  /**
   * 获取用户列表（支持搜索和分页）
   */
  static async getUsers({ email, username, nickname, role, pagination }) {
    const { currentPage, pageSize } = pagination;

    const condition = {
      where: {},
      attributes: { exclude: ['password'] }, // 排除密码字段
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    };

    // 搜索条件
    const searchConditions = [];

    if (email) {
      searchConditions.push({ email: { [Op.like]: `%${email}%` } });
    }

    if (username) {
      searchConditions.push({ username: { [Op.like]: `%${username}%` } });
    }

    if (nickname) {
      searchConditions.push({ nickname: { [Op.like]: `%${nickname}%` } });
    }

    if (role !== undefined && role !== '') {
      searchConditions.push({ role: role });
    }

    if (searchConditions.length > 0) {
      condition.where = {
        [Op.and]: searchConditions
      };
    }

    const { rows: users, count: total } = await User.findAndCountAll(condition);

    return {
      users,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  /**
   * 根据ID获取单个用户
   */
  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // 排除密码字段
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * 创建新用户
   */
  static async createUser(userData) {
    const filteredData = this.filterAllowedFields(userData);
    const user = await User.create(filteredData);

    // 返回时排除密码
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  /**
   * 更新用户
   */
  static async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const filteredData = this.filterAllowedFields(userData);
    await user.update(filteredData);

    // 返回时排除密码
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  /**
   * 删除用户
   */
  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    await user.destroy();
    return user;
  }

  /**
   * 过滤允许的字段
   */
  static filterAllowedFields(data) {
    const allowedFields = [
      'email', 'username', 'password', 'nickname',
      'sex', 'company', 'introduce', 'role', 'avatar'
    ];
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}

module.exports = UserService; 