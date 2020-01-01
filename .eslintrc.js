module.exports = {
  parser: 'babel-eslint',
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external']],
        alphabetize: {
          order: 'asc'
        }
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier/@typescript-eslint'
      ],
      rules: {
        'import/no-unresolved': [
          'error',
          {
            ignore: ['^@ffstats/']
          }
        ],
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
