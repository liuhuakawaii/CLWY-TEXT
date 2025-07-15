'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 定义关联关系
      User.hasMany(models.Course, {
        foreignKey: 'userId',
        as: 'courses'
      });
    }

    /**
     * 验证密码是否正确
     * @param {string} password - 明文密码
     * @returns {boolean} - 密码是否匹配
     */
    validatePassword(password) {
      return bcrypt.compareSync(password, this.password);
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
        notEmpty: { msg: '密码不能为空' },
        notNull: { msg: '密码不能为空' }
      },
      set(value) {
        // 使用bcrypt对密码进行加密
        if (value) {
          const saltRounds = 10;
          const hashedPassword = bcrypt.hashSync(value, saltRounds);
          this.setDataValue('password', hashedPassword);
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