require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DB_URL',
    logging: false
  },
  test: {
    use_env_variable: 'DB_URL',
    logging: false
  },
  production: {
    use_env_variable: 'DB_URL',
    logging: false
  }
};
