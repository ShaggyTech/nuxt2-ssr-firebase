// process.env.DEBUG = 'nuxt:*'
const path = require('path')
const functions = require('firebase-functions')
const { Nuxt, Builder } = require('nuxt')
const consola = require('consola')
const express = require('express')
const compression = require('compression')
const serveStatic = require('serve-static')
const app = express()

const isDev = process.env.NODE_ENV === 'development'

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
    consola.info(
      `A file at ${req.url} was requested by the client and served by the functions server.`
    )
  }
  /**
   * The only thing nuxt should be rendering is valid HTML, everything else is handled via the serveStatic lines below
   * which will look in the server directory '~/prod/nuxt/dist /client/ + /static' for any files it can't find on the hosting server
   * Static files should be able to be placed in src/static folder and availabe if the client loses those static assets
   * and needs to ensure they are available, i.e. you just don't want them served from the hosting server.
   *
   * If requested from the client and not available on the hosting server, they will be sent
   * from the functions server. They can be retrieved from the functions server
   * i.e. service worker 'sw.js' file that is generated in src/static but also provided to the hosting server
   */

  /** Render the req with Nuxt */
  const {
    html /** String */,
    error /** (null|Object) */,
    redirected /** (null|Object) */
  } = await nuxt.renderRoute(req.url).catch(err => {
    console.log(err)
    res.redirect('404.html')
  })

  if (html) {
    consola.log(`nuxt renderRoute html: ${req.path}`)
    res.send(html)
  } else if (redirected) {
    consola.log(`nuxt renderRoute redirected: ${req.path}`)
    res.redirect(redirected.path)
  } else if (error) {
    consola.log(`nuxt renderRoute error: ${req.path} --error-- ${error}`)
    res.redirect('/404.html')
  }
}

app.use(compression())
app.use('/', express.static(path.join(__dirname, 'nuxt', 'dist')))
app.use('/assets/', serveStatic(path.join(__dirname, 'nuxt/dist/client')))
app.use(serveStatic(path.join(__dirname, 'nuxt/dist/client/static')))
app.use(handleRequest)

exports.nuxtssr = functions.https.onRequest(app)
