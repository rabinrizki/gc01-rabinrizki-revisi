'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const products = require('../data/product.json').map(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
      return el
     })
     await queryInterface.bulkInsert('Products', products)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {truncate:true, restartIdentity: true, cascade: true})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
