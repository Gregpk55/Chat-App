module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'prettier/prettier': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    semi: 'error',
    quotes: ['error', 'single'],
    'no-console': 'warn',
    indent: ['error', 2],
    'comma-dangle': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'max-len': ['warn', { code: 80 }],
    'no-extra-parens': 'error',
    'prefer-const': 'warn',
  },
};
