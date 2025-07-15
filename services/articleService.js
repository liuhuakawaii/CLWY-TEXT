const { Article } = require('../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../utils/response');

class ArticleService {
  /**
   * 获取文章列表（支持搜索和分页）
   */
  static async getArticles({ title, content, pagination }) {
    const { currentPage, pageSize } = pagination;

    const condition = {
      where: {},
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    };

    // 搜索条件
    if (title || content) {
      condition.where = {
        [Op.or]: []
      };

      if (title) {
        condition.where[Op.or].push({ title: { [Op.like]: `%${title}%` } });
      }

      if (content) {
        condition.where[Op.or].push({ content: { [Op.like]: `%${content}%` } });
      }
    }

    const { rows: articles, count: total } = await Article.findAndCountAll(condition);

    return {
      articles,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  /**
   * 根据ID获取单个文章
   */
  static async getArticleById(id) {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    return article;
  }

  /**
   * 创建新文章
   */
  static async createArticle(articleData) {
    const filteredData = this.filterAllowedFields(articleData);
    return await Article.create(filteredData);
  }

  /**
   * 更新文章
   */
  static async updateArticle(id, articleData) {
    const article = await this.getArticleById(id);
    const filteredData = this.filterAllowedFields(articleData);
    await article.update(filteredData);
    return article;
  }

  /**
   * 删除文章
   */
  static async deleteArticle(id) {
    const article = await this.getArticleById(id);
    await article.destroy();
    return article;
  }

  /**
   * 过滤允许的字段
   */
  static filterAllowedFields(data) {
    const allowedFields = ['title', 'content'];
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}

module.exports = ArticleService; 