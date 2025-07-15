const { Course, Category, User } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../utils/response');

class CourseService {
  /**
   * 获取课程列表（支持搜索和分页）
   */
  static async getCourses({ title, categoryId, userId, recommended, pagination }) {
    const { currentPage, pageSize } = pagination;

    const condition = {
      where: {},
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'rang']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar']
        }
      ],
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    };

    // 搜索条件
    const searchConditions = [];

    if (title) {
      searchConditions.push({ title: { [Op.like]: `%${title}%` } });
    }

    if (categoryId) {
      searchConditions.push({ categoryId: categoryId });
    }

    if (userId) {
      searchConditions.push({ userId: userId });
    }

    if (recommended !== undefined && recommended !== '') {
      searchConditions.push({ recommended: recommended === 'true' });
    }

    if (searchConditions.length > 0) {
      condition.where = {
        [Op.and]: searchConditions
      };
    }

    const { rows: courses, count: total } = await Course.findAndCountAll(condition);

    return {
      courses,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  /**
   * 根据ID获取单个课程
   */
  static async getCourseById(id) {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'rang']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar']
        }
      ]
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  /**
   * 创建新课程
   */
  static async createCourse(courseData) {
    const filteredData = this.filterAllowedFields(courseData);
    const course = await Course.create(filteredData);

    // 返回包含关联信息的课程
    return await this.getCourseById(course.id);
  }

  /**
   * 更新课程
   */
  static async updateCourse(id, courseData) {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const filteredData = this.filterAllowedFields(courseData);
    await course.update(filteredData);

    // 返回包含关联信息的课程
    return await this.getCourseById(id);
  }

  /**
   * 删除课程
   */
  static async deleteCourse(id) {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    await course.destroy();
    return course;
  }

  /**
   * 获取推荐课程
   */
  static async getRecommendedCourses(limit = 10) {
    const courses = await Course.findAll({
      where: { recommended: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'rang']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar']
        }
      ],
      order: [['id', 'DESC']],
      limit: limit
    });

    return courses;
  }

  /**
   * 根据分类获取课程
   */
  static async getCoursesByCategory(categoryId, pagination) {
    const { currentPage, pageSize } = pagination;

    const condition = {
      where: { categoryId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'rang']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar']
        }
      ],
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    };

    const { rows: courses, count: total } = await Course.findAndCountAll(condition);

    return {
      courses,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  /**
   * 过滤允许的字段
   */
  static filterAllowedFields(data) {
    const allowedFields = [
      'categoryId', 'userId', 'title', 'image',
      'recommended', 'content', 'likesCount', 'chaptersCount'
    ];
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}

module.exports = CourseService; 