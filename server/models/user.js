
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
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          message: 'username must be alpha-numeric'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'email address entered not valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 6
      }
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Document, {
      foreignKey: 'userId'
    });
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
