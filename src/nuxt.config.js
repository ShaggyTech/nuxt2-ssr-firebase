const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  debug: true,
  dev: isDev,
  /*
   ** Headers of the page
   */
  head: {
    title: "Nuxt.js 2 - SSR on Firebase Functions",

    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        property: "og:title",
        content: "Nuxt.js 2 - SSR on Firebase Functions"
      },
      {
        property: "og:description",
        content:
          "Nuxt.js 2 app with SSR using Firebase Cloud Functions and Firebase Hosting. Made by David Royer"
      },
      {
        property: "og:image",
        content: "https://nuxt2ssrfire.firebaseapp.com/site.jpg"
      },
      {
        property: "twitter:card",
        content: "summary_large_image"
      },
      {
        property: "twitter:site",
        content: "@davidroyer_"
      },
      {
        property: "twitter:creator",
        content: "@davidroyer_"
      },
      {
        hid: "description",
        name: "description",
        content:
          "Nuxt.js 2 app with SSR using Firebase Cloud Functions and Firebase Hosting. Made by David Royer"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Roboto"
      },
      {
        rel: "stylesheet",
        href: "https://cdn.muicss.com/mui-0.9.35/css/mui.min.css"
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: "#3B8070"
  },

  generate: {
    fallback: '/index.html'
  },
  workbox: {
    // globPatterns: ['**/*.{js,css}', '**/img/*'],
    offlinePage: '/index.html',
    workboxURL: '/workbox/workbox-sw.js',
    publicPath: '/',
    config: {
      modulePathPrefix: '/workbox/'
    },
    preCaching: [

    ],
    runtimeCaching: [
      {
        urlPattern: 'https://fonts.googleapis.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      },
      {
        urlPattern: 'https://fonts.gstatic.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      }
    ]
  },

  manifest: {  
    name: 'Nuxt.js PWA On Firebase Functions',
    short_name: 'Nuxt.js Firebase',
    lang: 'en',
    display: 'standalone',
    theme_color: "#3B8070"
  },
  /*
  ** Modules
  */
  modules: ["@nuxtjs/pwa"],

  /*
   ** Global CSS
   */
  css: ["~/assets/styles/main.css"],
  buildDir: "../prod/server/nuxt",
  build: {
    publicPath: "/assets/",
    cache: true,
     /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      if (process.browser) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
};
