'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 定义关联关系
      Course.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });

      Course.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '分类ID不能为空'
        },
        notNull: {
          msg: '分类ID不能为空'
        },
        isInt: {
          msg: '分类ID必须是整数'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '用户ID不能为空'
        },
        notNull: {
          msg: '用户ID不能为空'
        },
        isInt: {
          msg: '用户ID必须是整数'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '课程标题不能为空'
        },
        notNull: {
          msg: '课程标题不能为空'
        },
        len: {
          args: [1, 255],
          msg: '课程标题长度必须在1到255个字符之间'
        }
      }
    },
    image: DataTypes.STRING,
    recommended: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};