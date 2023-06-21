const { defineConfig } = require("cypress");

module.exports = defineConfig({
    //defaultCommandTimeout: 100000,
    requestTimeout: 100000,
    //retries: 1,
    e2e: {
        baseUrl: 'https://kitchen-stage.relex-dev.ru/',
      // We've imported your old cypress plugins here.
      // You may want to clean this up later by importing these.
      setupNodeEvents(on, config) {
        return require('./cypress/plugins/index.js')(on, config)
      }
    },
});
