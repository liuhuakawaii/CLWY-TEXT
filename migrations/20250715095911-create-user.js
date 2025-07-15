'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sex: {
        type: Sequelize.TINYINT.UNSIGNED,
        defaultValue: 9
      },
      company: {
        type: Sequelize.STRING
      },
      introduce: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('Users', {
      fields: ['email'],
      unique: true
    });
    await queryInterface.addIndex('Users', {
      fields: ['username'],
      unique: true
    });
    await queryInterface.addIndex('Users', {
      fields: ['role'],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
