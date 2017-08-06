

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [{
      name: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'editor',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
