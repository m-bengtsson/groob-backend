module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@babel/eslint-parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
};
