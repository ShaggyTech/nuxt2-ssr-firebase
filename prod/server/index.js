// process.env.DEBUG = 'nuxt:*'

const isDev = process.env.NODE_ENV === 'development' ? true : false

const functions = require('firebase-functions')
const { Nuxt } = require('nuxt')
const compression = require('compression')
const express = require('express')
const app = express()
const serveStatic = require('serve-static')
const path = require('path')
app.use(compression())

const nuxtConfig = require('./nuxt.config.js')

const config = {
  ...nuxtConfig,
  dev: isDev,
  debug: true,
  buildDir: 'nuxt'
}
const nuxt = new Nuxt(config)

async function handleRequest(req, res) {
  if (isDev) {
    res.set('Cache-Control', 'public, max-age=150, s-maxage=150')
  }
  /**
   * The only thing nuxt should be rendering is valid HTML, everything else is handled via the serveStatic
   * which will look in the server directory 'nuxt/dist/client/static' for any files it can't find on the hosting server
   * Static files should be able to be placed in nuxt/dist/client/static folder and availabe
   * if the client loses those static assets and needs to ensure they are available
   * they can be retrieved from the functions server (i.e. service worker 'sw.js' file)
   */
  await nuxt
    .renderRoute(req.path)
    .then(({ html }) => {
      res.send(html)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/404.html')
    })
}

app.use(serveStatic(path.join(__dirname, 'nuxt/dist/client/static')))
app.use(handleRequest)

exports.nuxtssr = functions.https.onRequest(app)
