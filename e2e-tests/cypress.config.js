import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  screenshotsFolder: "screenshots",
  videosFolder: "videos",

  e2e: {
    specPattern: "tests/**/*.cy.{js,jsx}",
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
