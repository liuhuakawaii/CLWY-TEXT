const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { Op, or } = require('sequelize');
const { success, failure, NotFoundError } = require('../../utils/response');

router.get('/', async function (req, res, next) {
  try {
    const { title, content } = req.query;
    const currentPage = parseInt(req.query.currentPage) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const condition = {
      where: {},
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }
    if (title || content) {
      condition.where = {
        [Op.or]: [
          { title: { [Op.like]: `%${title}%` } },
          { content: { [Op.like]: `%${content}%` } }
        ]
      }
    }
    // const articles = await Article.findAll(condition)
    const { rows: articles, count: total } = await Article.findAndCountAll(condition)
    success(res, 'Articles fetched successfully', {
      articles,
      pagination: {
        currentPage,
        pageSize,
        total
      }
    }, 200);
  } catch (error) {
    failure(res, error);
  }

});

router.get('/:id', async function (req, res, next) {
  try {
    const article = await getArticle(req);
    success(res, 'Article fetched successfully', article, 200);
  } catch (error) {
    failure(res, error);
  }
});

// 创建新文章
router.post('/', async (req, res) => {
  try {
    // 过滤掉req.body中的非法字段
    const body = filterBody(req.body);

    //验证
    const article = await Article.create(body);
    success(res, 'Article created successfully', article, 201);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      failure(res, error);
    }
    failure(res, error);
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  try {
    const article = await getArticle(req);
    await article.destroy();
    success(res, 'Article deleted successfully', null, 200);
  } catch (error) {
    failure(res, error);
  }
});

//更新文章
router.put('/:id', async (req, res) => {
  try {
    const body = filterBody(req.body);
    const article = await getArticle(req);
    await article.update(body);
    success(res, 'Article updated successfully', article, 200);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      failure(res, error);
    } else {
      failure(res, error);
    }
  }
});

function filterBody(body) {
  const allowedFields = ['title', 'content'];
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );
}

async function getArticle(req) {
  const { id } = req.params;
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFoundError('Article not found');
  }
  return article;
}

module.exports = router;
