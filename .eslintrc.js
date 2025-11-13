module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable problematic rules for deployment
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-img-element': 'off',
  },
}