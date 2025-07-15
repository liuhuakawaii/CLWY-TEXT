'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync('a123456', saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@clwy.com',
        username: 'admin',
        password: hashedPassword,
        nickname: 'admin',
        sex: 2,
        company: 'clwy',
        introduce: 'admin',
        role: 100,
        avatar: 'https://clwy.com/avatar.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@clwy.com',
        username: 'user',
        password: hashedPassword,
        nickname: 'user',
        sex: 2,
        company: 'clwy',
        introduce: 'user',
        role: 0,
        avatar: 'https://clwy.com/avatar.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@clwy.com',
        username: 'user2',
        password: hashedPassword,
        nickname: 'user2',
        sex: 2,
        company: 'clwy',
        introduce: 'user2',
        role: 0,
        avatar: 'https://clwy.com/avatar.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
