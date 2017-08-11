
/**
 * @description define User database model
 * @param {Object} sequelize - sequelize object
 * @param {Object} DataTypes - data types
 * @returns {Object} - instance of User database model
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'First Name Required' },
        isAlpha: { args: true, msg: 'First Name Is Invalid' },
        len: { args: [2, 40], msg: 'First name too short or too long' }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'Last Name Required' },
        isAlpha: { args: true, msg: 'Last Name Is Invalid' },
        len: { args: [2, 40], msg: 'Last name too short or too long' }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'User already exist, choose a different username'
      },
      validate: {
        notEmpty: { args: true, msg: 'Username Required' },
        isAlphanumeric: { args: true, msg: 'Username not valid' },
        len: { args: [2, 40], msg: 'username too short or too long' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'User already exist, choose a diffrent email'
      },
      validate: {
        notEmpty: { args: true, msg: 'Email Required' },
        isEmail: { args: true, msg: 'Email Required' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'Password Required' },
      }
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      validate: {
        notEmpty: { args: true, msg: 'Role Required' },
        isInt: { args: true, msg: 'Role id must be an integer' }
      }
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Document, {
      foreignKey: 'userId'
    });
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'SET DEFAULT',
    });
  };
  return User;
};
