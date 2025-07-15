'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: '请输入正确的邮箱地址'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/,
          msg: '用户名必须以字母开头，长度为5-15个字符'
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 10],
          msg: '昵称长度必须在2到10个字符之间'
        }
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 2,
      validate: {
        isIn: {
          args: [[0, 1, 2]],
          msg: '性别必须是0、1、2'
        }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 100]],
          msg: '普通用户：0，管理员：100'
        }
      }
    },
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};