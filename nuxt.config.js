export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'StayUp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.sykesdev.ca/themes/bootstrap-lux-theme/bootstrap.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  buildDir: 'dist',

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Environment configuration
  publicRuntimeConfig: {
    API_WEBSOCK_URL:
      process.env.API_WEBSOCK_URL || 'ws://localhost:5555/api/service/ws',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5555/api',
  },

  privateRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5555/api',
  },
}
