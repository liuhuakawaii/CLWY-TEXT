const { Category } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../utils/response');

class CategoryService {
  /**
   * 获取分类列表（支持搜索和分页）
   */
  static async getCategories({ name, pagination }) {
    const { currentPage, pageSize } = pagination;

    const condition = {
      where: {},
      order: [['rang', 'ASC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    };

    // 搜索条件
    if (name) {
      condition.where = {
        name: { [Op.like]: `%${name}%` }
      };
    }

    const { rows: categories, count: total } = await Category.findAndCountAll(condition);

    return {
      categories,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  /**
   * 根据ID获取单个分类
   */
  static async getCategoryById(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  /**
   * 创建新分类
   */
  static async createCategory(categoryData) {
    const filteredData = this.filterAllowedFields(categoryData);
    return await Category.create(filteredData);
  }

  /**
   * 更新分类
   */
  static async updateCategory(id, categoryData) {
    const category = await this.getCategoryById(id);
    const filteredData = this.filterAllowedFields(categoryData);
    await category.update(filteredData);
    return category;
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    await category.destroy();
    return category;
  }

  /**
   * 过滤允许的字段
   */
  static filterAllowedFields(data) {
    const allowedFields = ['name', 'rang'];
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}

module.exports = CategoryService;

