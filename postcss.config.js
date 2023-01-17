module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
        browsers: '> 5% in KR, defaults, not IE < 11',
        autoprefixer: { grid: 'autoplace' },
      },
    ],
  ],
};
