'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init({
    report_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    store_id: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    uptime_last_hour: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    uptime_last_day: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    uptime_last_week: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    downtime_last_hour: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    downtime_last_day: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    downtime_last_week: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};