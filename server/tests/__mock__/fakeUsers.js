import Authorization from '../../helpers/Authorization';

export default {
  newUser: {
    firstName: 'Mary',
    lastName: 'Kay',
    username: 'marykay',
    email: 'marykay@gmail.com',
    password: Authorization.encryptPassword('123456')
  },
  existingUser: {
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'janedoe',
    email: 'janedoe@gmail.com',
    password: Authorization.encryptPassword('123456')
  },
  invalidPassword: {
    firstName: 'Emily',
    lastName: 'Grace',
    username: 'emilygrace',
    email: 'emilygrace@gmail.com'
  },
  invalidUsername: {
    firstName: 'Besty',
    lastName: 'Grace',
    username: '7565768686',
    email: 'emilygrace@gmail.com',
    password: Authorization.encryptPassword('123456')
  },
  invalidUser: {
    firstName: 'Kate',
    lastName: '64354375',
    username: 'kateskillet',
    email: 'kateskillet@gmail.com',
    password: Authorization.encryptPassword('123456')
  },
  superAdminLoginDetail: {
    username: 'superadmin',
    password: '123456'
  },
  adminLoginDetail: {
    username: 'janedoe',
    password: '123456'
  },
  regularUserDetail: {
    username: 'johndoe',
    password: '123456'
  },
  anotherRegularUserDetail: {
    username: 'nancykate17',
    password: '123456'
  },
  wrongLoginDetail: {
    username: 'janedoe',
    password: 'jdvgdhjhhj'
  },
  invalidLoginDetail: {
    username: '345653',
    password: 'jdvgdhjhhj'
  }
};
