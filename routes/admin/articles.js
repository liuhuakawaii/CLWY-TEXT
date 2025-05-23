const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { Op, or } = require('sequelize');


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
    res.json({
      status: true,
      message: 'Articles fetched successfully',
      data: {
        articles,
        pagination: {
          currentPage,
          pageSize,
          total
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: [error.message],
      data: null
    })
  }

});

router.get('/:id', async function (req, res, next) {
  try {
    console.log(req.params, '----')
    const article = await Article.findByPk(req.params.id)
    if (!article) {
      return res.status(404).json({
        status: false,
        message: ['Article not found'],
        data: null
      })
    }
    res.json({
      status: true,
      message: 'Article fetched successfully',
      data: article
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: [error.message],
      data: null
    })
  }
});

// 创建新文章
router.post('/', async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json({
      status: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: [error.message],
      data: null
    })
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        status: false,
        message: ['Article not found'],
        data: null
      });
    }
    await article.destroy();
    res.status(200).json({
      status: true,
      message: ['Article deleted successfully'],
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: [error.message],
      data: null
    })
  }
});

//更新文章
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await Article.findOne({ where: { id: req.params.id } });
    if (!article) {
      return res.status(404).json({
        status: false,
        message: ['Article not found'],
        data: null
      });
    }
    article.title = title;
    article.content = content;
    await article.save();
    res.json({
      status: true,
      message: ['Article updated successfully'],
      data: article
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: [error.message],
      data: null
    })
  }
});

module.exports = router;
