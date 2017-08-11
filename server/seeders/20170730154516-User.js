const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);
const hashPassword = password => bcrypt.hashSync(password, salt);

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Mighty',
      lastName: 'Joe',
      username: 'superadmin',
      email: 'superadmin@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      password: hashPassword('123456'),
      isBlocked: true,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe',
      email: 'janedoe@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Nancy',
      lastName: 'Kate',
      username: 'nancykate17',
      email: 'nancykate17@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Mike',
      lastName: 'Olean',
      username: 'mikeolean',
      email: 'mikeolean@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Lester',
      lastName: 'Fox',
      username: 'lesterfox',
      email: 'lesterfox@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Kings',
      lastName: 'Okezie',
      username: 'kingsags',
      email: 'kingsags@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Zeal',
      lastName: 'Styles',
      username: 'zealstyles',
      email: 'zealstyles@gmail.com',
      password: hashPassword('123456'),
      isBlocked: false,
      roleId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

