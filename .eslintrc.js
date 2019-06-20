module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'modules': true,
      'experimentalObjectRestSpread': true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
