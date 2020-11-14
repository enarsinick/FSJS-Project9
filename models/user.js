'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
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
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A first name is required"
        },
        notEmpty: {
          msg: "Please provide a first name"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A last name is required"
        },
        notEmpty: {
          msg: "Please provide a last name"
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "That email already exists!"
      }, 
      validate: {
        notNull: {
          msg: "An email address is required"
        },
        isEmail: {
          msg:"Please provide a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
      validate: {
        notNull: {
          msg: "A password is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};