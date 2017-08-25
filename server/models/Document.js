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
      unique: { args: true, msg: 'Document title already exist' },
      validate: {
        notEmpty: { args: true, msg: 'Document title Required' },
        len: {
          args: [5, 200],
          msg: 'title should be between 5 - 200 characters'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'Document content Required' },
        len: {
          args: [20],
          msg: 'Document content should be at least 20 characters'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'user id required' }
      }
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: {
        notEmpty: { args: true, msg: 'Document access type required' },
        isIn: {
          args: [['role', 'private', 'public']],
          msg: 'Invalid access type provided'
        }
      }
    }
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'SET NULL'
    });
  };
  return Document;
};
