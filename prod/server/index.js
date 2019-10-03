// process.env.DEBUG = 'nuxt:*'

const path = require('path')
const functions = require('firebase-functions')
const { Nuxt } = require('nuxt')
const consola = require('consola')
const connect = require('connect')
const compression = require('compression')
const serveStatic = require('serve-static')

const isDev = process.env.NODE_ENV === 'development'

/** Setup Nuxt config */
const nuxtConfig = require('./nuxt.config.js')
const config = {
  ...nuxtConfig,
  dev: isDev,
  debug: true,
  buildDir: 'nuxt'
}
/** Instatiate Nuxt isntance with our modified config */
const nuxt = new Nuxt(config)

/** Should only be handling direct page routes that will result in valid HTML */
async function nuxtHandler(req, res) {
  consola.log(req.url)
  /** Set development options */
  if (isDev) {
    res.set('Cache-Control', 'public, max-age=150, s-maxage=150')
    consola.info(`Dev Cache Control Set`)
  }
  /** Render the req with Nuxt renderRoute() */
  const {
    html /** String */,
    error /** (null|Object) */,
    redirected /** (false|Object) */
  } = await nuxt.renderRoute(req.url).catch(err => {
    consola.err(`Nuxt render error - ${err} || STACK:: ${err.stack}`)
    res.redirect('/404.html')
  })

  if (html) {
    res.send(html)
  } else if (redirected) {
    res.redirect(redirected.path)
  } else if (error) {
    consola.info(`nuxt renderRoute error: ${req.path} --error-- ${error}`)
    res.send(`Nuxt renderRouter error: ${error}`)
  }
}

const app = connect()

app.use(compression())

app.use(serveStatic(path.join(__dirname, 'nuxt', 'dist')))
app.use(serveStatic(path.join(__dirname, 'nuxt/dist/client/static')))
app.use('/assets/', serveStatic(path.join(__dirname, 'nuxt/dist/client')))
app.use('*', nuxt.render)
app.use(nuxtHandler)

exports.nuxtssr = functions.https.onRequest(app)
