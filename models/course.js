'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        as: "owner",
        foreignKey: {
          fieldName: "userId",
          allowNull: false,
          validate: {
            notNull: {
              msg: "A course owner ID is required",
            },
            notEmpty: {
              msg: "Please provide a course owner ID"
            }
          }
        }
      });
    }
  };
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a title"
        },
        notEmpty: {
          msg: "Please provide a valid title"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a description"
        },
        notEmpty: {
          msg: "Please provide a valid description"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Course'
  });
  return Course;
};