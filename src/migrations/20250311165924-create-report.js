'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      report_name: { type: Sequelize.STRING, allowNull: false },
      store_id: { type: Sequelize.STRING, allowNull: false },
      uptime_last_hour: { type: Sequelize.STRING, allowNull: false },
      uptime_last_day: { type: Sequelize.STRING, allowNull: false },
      uptime_last_week: { type: Sequelize.STRING, allowNull: false },
      downtime_last_hour: { type: Sequelize.STRING, allowNull: false },
      downtime_last_day: { type: Sequelize.STRING, allowNull: false },
      downtime_last_week: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  }
};