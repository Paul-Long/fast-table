module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['>0%']
    }),
    require('cssnano')
  ]
};
