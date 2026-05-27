import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  screenshotsFolder: "screenshots",
  videosFolder: "videos",

  e2e: {
    specPattern: "tests/**/*.cy.{js,jsx}",
    supportFile: false,
    setupNodeEvents(on, config) {
      // Use direct spec execution for plain JS tests and avoid webpack preprocessing.
      on("file:preprocessor", (file) => file.filePath);
      return config;
    },
  },
});
