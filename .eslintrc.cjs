module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "standard"],
  overrides: [],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "block-spacing": ["error", "always"],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
    "comma-dangle": ["error", "only-multiline"],
    "space-before-function-paren": ["error", {
      anonymous: "always",
      named: "never",
      asyncArrow: "always"
    }],
    "operator-linebreak": ["error", "after"]
  },
};
