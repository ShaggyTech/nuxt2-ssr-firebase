// process.env.DEBUG = 'nuxt:*'

const IS_DEV = process.env.NODE_ENV === 'development' ? true : false

const functions = require('firebase-functions')
const { Nuxt } = require('nuxt')
const compression = require('compression')
const express = require('express')
const app = express()
app.use(compression())

const nuxtConfig = require('./nuxt.config.js')

const config = {
  ...nuxtConfig,
  dev: false,
  debug: true,
  buildDir: 'nuxt'
}
const nuxt = new Nuxt(config)

async function handleRequest(req, res) {
  if (!IS_DEV) {
    res.set('Cache-Control', 'public, max-age=150, s-maxage=150')
  }
  // Render with Nuxt
  // The only thing nuxt should be rendering is valid HTML
  await nuxt
    .renderRoute('/')
    .then(({ html }) => {
      res.send(html)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/404.html')
    })
}

app.use(handleRequest)
exports.nuxtssr = functions.https.onRequest(app)
