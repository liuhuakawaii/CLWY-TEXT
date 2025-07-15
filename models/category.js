'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: '名称已存在，请重新输入'
      },
      validate: {
        notNull: {
          msg: '名称必须填写'
        },
        notEmpty: {
          msg: '名称不能为空'
        },
        len: {
          args: [2, 45],
          msg: '名称长度必须在2到45个字符之间'
        }
      }
    },
    rang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '排序必须填写'
        },
        notEmpty: {
          msg: '排序不能为空'
        },
        isInt: {
          msg: '排序必须是整数'
        },
        isPositive(v) {
          if (v <= 0) {
            throw new Error('排序必须大于0');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};