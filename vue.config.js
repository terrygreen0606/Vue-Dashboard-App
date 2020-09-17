module.exports = {
  devServer: {
    disableHostCheck: true,
  },

  transpileDependencies: ['vue-world-map', 'vuetify'],

  chainWebpack: config => {
    const pdfRule = config.module.rule('pdf')
    const zipRule = config.module.rule('zip')
    pdfRule
      .test(/\.pdf$/)
      .use('file-loader').loader('file-loader')
    zipRule.test(/\.zip$/).use('file-loader').loader('file-loader')
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
