
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
      unique: true,
      validate: {
        notEmpty: true
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
