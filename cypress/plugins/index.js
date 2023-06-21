require('dotenv').config();

module.exports = (on, config) => {
  config.baseUrl = process.env.BASE_URL;
  return config;
}
