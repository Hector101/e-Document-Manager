
/**
 * @description define Role database model
 * @param {Object} sequelize - sequelize object
 * @param {Object} DataTypes - data types
 * @returns {Object} - instance of Role database model
 */
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { args: true, msg: 'Role already exist' },
      validate: {
        notEmpty: { args: true, msg: 'Role Required' },
        isAlpha: { args: true, msg: 'Provide a valid role name' }
      }
    }
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};
