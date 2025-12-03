import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: false,
  devtools: { enabled: false },
  compatibilityDate: '2025-01-15',

  typescript: {
    strict: true,
    typeCheck: false,
  },

  css: ['~/shared/assets/styles/app.scss'],

  devServer: {
    port: 3333,
  },

  app: {
    head: {
      title: 'Starpets-test-dmitriev',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'theme-color', content: '#000000' },
        { name: 'google', content: 'notranslate' },
        { name: 'HandheldFriendly', content: 'True' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Inter: [300, 400, 500, 600, 700, 800, 900],
        },
        display: 'swap',
      },
    ],
  ],

  pinia: {
    storesDirs: ['./app/model/**', './entities/**/model/**', './features/**/model/**'],
  },

  components: [
    { path: '~/shared/ui', pathPrefix: false, prefix: 'UI' },
    { path: '~/entities', pathPrefix: false, ignore: ['**/api/**', '**/model/**'] },
    { path: '~/widgets', pathPrefix: false },
  ],

  imports: {
    dirs: [
      './shared/lib/**',
      './shared/api/**',
      './shared/types/**',
      './shared/config/**',
      './app/model/**',
      './entities/**/model/**',
      './entities/**/api/**',
      './features/**/model/**',
    ],
  },

  experimental: {
    defaults: {
      nuxtLink: {
        activeClass: 'is-active',
      },
    },
  },

  vite: {
    plugins: [svgLoader()],
  },
});
