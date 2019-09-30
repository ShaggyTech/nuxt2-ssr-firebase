// process.env.DEBUG = 'nuxt:*'

const isDev = process.env.NODE_ENV === 'development' ? true : false

const functions = require('firebase-functions')
const { Nuxt } = require('nuxt')
const compression = require('compression')
const express = require('express')
const app = express()
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
  // Render with Nuxt
  // The only thing nuxt should be rendering is valid HTML
  /**
   * Static files should be able to be placed in nuxt/dist/client/static folder and availabe
   * if the client loses those static assets and needs to ensure they are available
   * CURRENTLY BROKEN!  Will not catch .html files but will catch all (.) files
   */
  if (/^[^.]+.$/.test(req.path)) {
    console.log('FOUND HTML! at requested path: ' + req.path)
    await nuxt
      .renderRoute(req.path)
      .then(({ html }) => {
        res.send(html)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/index.html')
      })
  } else res.sendFile(require('path').join(__dirname, '/nuxt/dist/client/static',req.path))
}

// app.get('*', (req, res) => res.send(nuxt.render));
app.use(handleRequest)

exports.nuxtssr = functions.https.onRequest(app)
