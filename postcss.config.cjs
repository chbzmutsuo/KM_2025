
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    // '@pandacss/dev/postcss': {},

    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
}
