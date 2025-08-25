module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "eslint:recommended"
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // project-specific overrides
  },
};