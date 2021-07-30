module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    "consistent-return": "off",
    "no-unreachable": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": "off",
    "max-len": "off"
  },
};
