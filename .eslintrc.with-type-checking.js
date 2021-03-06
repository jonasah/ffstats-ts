const config = require('./.eslintrc.js');

// extend config for TypeScript files to enable checks that require type checking
const eslintConfigTs = config.overrides[0];

eslintConfigTs.extends.push(
  'plugin:@typescript-eslint/recommended-requiring-type-checking'
);
eslintConfigTs.parserOptions = {
  project: './tsconfig.json'
};
eslintConfigTs.rules = {
  ...eslintConfigTs.rules,
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-readonly': 'error',
  '@typescript-eslint/require-array-sort-compare': 'error'
};

module.exports = config;
