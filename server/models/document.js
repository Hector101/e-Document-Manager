
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
        notEmpty: { args: true, msg: 'Document title should not be empty' },
        len: { args: [10, 70], msg: 'Title should be at least 10 characters and at most 70' }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'Document content should not be empty' }
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: [['role', 'private', 'public']],
      }
    }
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'SET NULL',
    });
  };
  return Document;
};
