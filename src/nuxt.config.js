const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  debug: true,
  dev: isDev,
  /*
   ** Headers of the page
   */
  head: {
    title: 'Nuxt.js 2 - SSR on Firebase Functions',

    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        property: 'og:title',
        content: 'Nuxt.js 2 - SSR on Firebase Functions'
      },
      {
        property: 'og:description',
        content:
          'Nuxt.js 2 app with SSR using Firebase Cloud Functions and Firebase Hosting. Made by David Royer'
      },
      {
        property: 'og:image',
        content: 'https://nuxt2ssrfire.firebaseapp.com/site.jpg'
      },
      {
        property: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        property: 'twitter:site',
        content: '@davidroyer_'
      },
      {
        property: 'twitter:creator',
        content: '@davidroyer_'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Nuxt.js 2 app with SSR using Firebase Cloud Functions and Firebase Hosting. Made by David Royer'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.muicss.com/mui-0.9.35/css/mui.min.css'
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },

  axios: {
    proxy: true
  },

  proxy: {
    // '/api/': { target: 'http://api.example.com', pathRewrite: { '^/api/': '' } }
  },
  sitemap: {
    hostname: 'https://nuxt-ssr-firebase-hosting.firebaseapp.com/',
    gzip: true,
    exclude: ['/secret', '/admin/**']
    // routes: [
    //   '/page/1',
    //   {
    //     url: '/page/2',
    //     changefreq: 'daily',
    //     priority: 1,
    //     lastmodISO: '2017-06-30T13:30:00.000Z'
    //   }
    // ]
  },

  generate: {
    fallback: true,
    exclude: [
      /** Individual */ /^(?=.*\btest\b).*$/
      /** All Except */ // /\b(?!index|test)\b\S+/
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html}'],
    preCaching: ['index.html'],
    runtimeCaching: [
      {
        urlPattern: '^https://fonts.googleapis.com/',
        handler: 'staleWhileRevalidate',
        method: 'GET',
        strategyOptions: {
          cacheName: 'google-fonts-stylesheets',
          cacheableResponse: { statuses: [0, 200] }
        }
      },
      {
        urlPattern: '^https://fonts.gstatic.com/',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: {
          cacheName: 'google-fonts-webfonts',
          cacheableResponse: { statuses: [0, 200] },
          cacheExpiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365,
            maxEntries: 30
          }
        }
      }
    ]
  },

  manifest: {
    name: 'Nuxt.js PWA On Firebase Functions',
    short_name: 'Nuxt.js Firebase',
    lang: 'en',
    display: 'standalone',
    theme_color: '#3B8070'
  },

  robots: {
    UserAgent: '*',
    Disallow: '/admin',
    Sitemap: 'https://nuxt-ssr-firebase-hosting.firebaseapp.com//sitemap.xml.gz'
  },
  /*
   ** Modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],

  /*
   ** Global CSS
   */
  css: ['~/assets/styles/main.css'],
  buildDir: '../prod/server/nuxt',
  build: {
    publicPath: '/assets/',
    cache: true,
    /*
     ** extend
     */
    extend(config, { isDev, isClient }) {
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|nuxt|dist|client)/
        })
      }
    }
  }
}
