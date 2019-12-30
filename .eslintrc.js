module.exports = {
  parser: 'babel-eslint',
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            overrides: {
              constructors: 'no-public'
            }
          }
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-magic-numbers': [
          'error',
          { ignore: [-1, 0, 1], ignoreEnums: true, ignoreReadonlyClassProperties: true }
        ],
        '@typescript-eslint/no-require-imports': 'error',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/unified-signatures': 'error'
      },
      overrides: [
        {
          files: ['*.test.ts', '*.mock.ts'],
          rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-magic-numbers': 'off'
          }
        },
        {
          files: ['apps/convertroster/**/*.ts'],
          rules: {
            '@typescript-eslint/no-magic-numbers': 'off'
          }
        },
        {
          files: ['libs/database/src/*Repository.ts'],
          rules: {
            '@typescript-eslint/camelcase': 'off'
          }
        }
      ]
    }
  ]
};
