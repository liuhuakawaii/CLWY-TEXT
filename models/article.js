'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title is required',
        },
        notEmpty: {
          msg: 'Title is required',
        },
        len: {
          args: [2, 30],
          msg: 'Title must be between 2 and 30 characters',
        },
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Content is required',
          content: DataTypes.TEXT,
          notEmpty: {
            msg: 'Content is required',
          },
          len: {
            args: [1, 1000],
            msg: 'Content must be between 1 and 1000 characters',
          },
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};