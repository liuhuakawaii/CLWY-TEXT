const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');

// 导入错误处理中间件
const { errorHandler } = require('./utils/middleware');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由配置
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/articles', adminArticlesRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/settings', adminSettingsRouter);
app.use('/admin/users', adminUsersRouter);

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// 统一错误处理中间件（必须放在最后）
app.use(errorHandler);

module.exports = app;
