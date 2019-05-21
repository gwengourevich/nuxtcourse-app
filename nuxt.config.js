import pkg from './package'
const bodyParser = require('body-parser')

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { property: 'og:site_name', content: pkg.name }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#cfcfcf', height: '4px', duration: 5000 },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/core-components.js',
    '~plugins/date-filter.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    linkActiveClass: 'active',
    // middleware: 'log'
  },
  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  },
  env: {
    baseURL: process.env.BASE_URL || '', //include your firebase base url here
    fbAPIKey: '' //include your firebase API key here
  },
  serverMiddleware: [
    bodyParser.json(),
    '~/api'
  ]
}
