'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Categories', [
      {
        name: '前端开发',
        rang: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '后端开发',
        rang: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '全栈开发',
        rang: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '人工智能',
        rang: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '数据分析',
        rang: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'UI设计',
        rang: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
