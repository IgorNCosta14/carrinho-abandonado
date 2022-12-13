module.exports = {
  env: {
    es2021: true,
    node: true
  },
  files: ['**/*.ts?(x)'],
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parser: 'typescript-eslint-parser',
  plugins: ['typescript'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
