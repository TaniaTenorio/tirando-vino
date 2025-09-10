import config from "eslint-config-xo";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      camelcase: ["error", { properties: "never" }],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
]);
