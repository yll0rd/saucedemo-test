const fs = require("fs");
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/tests/**/*.cy.js",
    setupNodeEvents(on, config) {
      on("task", {
        clearPdfDownloads() {
          if (!fs.existsSync(config.downloadsFolder)) {
            return null;
          }

          fs.readdirSync(config.downloadsFolder)
            .filter((fileName) => fileName.toLowerCase().endsWith(".pdf"))
            .forEach((fileName) => {
              fs.unlinkSync(`${config.downloadsFolder}/${fileName}`);
            });

          return null;
        },
        listPdfDownloads() {
          if (!fs.existsSync(config.downloadsFolder)) {
            return [];
          }

          return fs.readdirSync(config.downloadsFolder)
            .filter((fileName) => fileName.toLowerCase().endsWith(".pdf"));
        },
      });
    },
  },
});
