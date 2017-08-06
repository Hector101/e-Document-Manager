require('dotenv').config();

module.exports = {
  development: {
    username: '',
    password: null,
    database: 'dms',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    use_env_variable: 'TEST_URL',
    logging: false
  },
  production: {
    use_env_variable: 'DB_URL',
    logging: false
  },
};
