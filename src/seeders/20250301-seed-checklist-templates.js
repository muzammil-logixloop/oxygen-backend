'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('ChecklistTemplates', [
      {
        type: 'Daily',
        version: 1,
        appliesToModels: JSON.stringify(["All"]),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'Weekly',
        version: 1,
        appliesToModels: JSON.stringify(["All"]),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'Monthly',
        version: 1,
        appliesToModels: JSON.stringify(["All"]),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChecklistTemplates', null, {});
  }
};
