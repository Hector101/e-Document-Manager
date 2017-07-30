
/**
 * @description define Document database model
 * @param {Object} sequelize - sequelize object
 * @param {Object} DataTypes - data types
 * @returns {Object} - instance of Document database model
 */
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
    }
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Document;
};
