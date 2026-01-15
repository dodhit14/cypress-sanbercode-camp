const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {

        baseUrl: 'https://opensource-demo.orangehrmlive.com', //UI
        env: {
            apiUrl: 'https://reqres.in/api', // API Url
            apiKey: 'reqres_73e73f2ce9924218a497b6ea0df55bbd' //Api Key
        },

        setupNodeEvents(on, config) {
          // implement node event listeners here
        },
    },
});
