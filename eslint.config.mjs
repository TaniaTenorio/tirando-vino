import config from "eslint-config-xo";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    rules: {
      camelcase: ["error", { properties: "never" }],
    },
  },
]);
