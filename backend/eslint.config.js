const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  { 
    files: ["**/*.{js,cjs}"], 
    languageOptions: { 
      globals: globals.node,
      sourceType: "commonjs"
    } 
  },
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      sourceType: "commonjs"
    }
  }
];
