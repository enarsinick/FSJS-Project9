'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: {
          fieldName: "userId"
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
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    password: DataTypes.VIRTUAL,
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (val === this.password) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: {
          notNull: {
              msg: 'Both passwords must match'
          }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};