'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,
        userId: 1,
        title: 'CSS 入门 1',
        content: 'Course 1 content',
        recommended: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryId: 1,
        userId: 1,
        title: 'CSS 入门 2',
        content: 'Course 2 content',
        recommended: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryId: 2,
        userId: 1,
        title: 'CSS 入门 3',
        content: 'Course 3 content',
        recommended: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
