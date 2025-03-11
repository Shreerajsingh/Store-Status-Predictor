'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class report_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  report_status.init({
    report_name: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Complete', 'Running'),
      allowNull: false,
      defaultValue: 'Running'
    }
  }, {
    sequelize,
    modelName: 'report_status',
  });
  return report_status;
};