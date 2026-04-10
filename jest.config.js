const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/e2e/",
  ],
  collectCoverageFrom: [
    "src/actions/auth/auth.ts",
    "src/app/admin/page.jsx",
    "src/app/api/admin/[type]/route.js",
    "src/app/api/checkout/route.js",
    "src/app/auth/components/LoginForm.jsx",
    "src/app/auth/components/RecoveryPasswordForm.jsx",
    "src/app/auth/components/SignUpForm.jsx",
    "src/app/components/HomeClient.jsx",
    "src/lib/supabase/storage-helpers.js",
    "src/utils/authMessages.js",
    "src/utils/helpers.js",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      lines: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
