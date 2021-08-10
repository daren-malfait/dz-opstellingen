module.exports = {
  plugins: [
    require(`postcss-import`)({
      plugins: [require(`stylelint`)],
    }),
    require(`tailwindcss`),
    require(`postcss-preset-env`)({
      stage: 1,
      features: {
        'focus-within-pseudo-class': false,
        'nesting-rules': true,
      },
      browsers: [`> 1%`, `last 2 versions`, `Firefox ESR`],
    }),
  ],
};
