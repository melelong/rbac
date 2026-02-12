export default {
  // 公共
  semi: false,
  singleQuote: true,
  printWidth: 150,
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
  ],
}
