'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs')
module.exports = {
  async up (queryInterface, Sequelize) {
    var salt = bcrypt.genSaltSync(10)
    const users = require('../data/user.json').map(el => {
     el.createdAt = el.updatedAt = new Date()
     el.password = bcrypt.hashSync(el.password, salt)
     return el
    })
    await queryInterface.bulkInsert('Users', users)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {truncate:true, restartIdentity: true, cascade: true})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
