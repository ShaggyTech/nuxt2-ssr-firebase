/**************************************
 * Constants
 **************************************/
const path = require('path')
/** Firebase */
const functions = require('firebase-functions')

/** Nuxt Related */
const { Nuxt } = require('nuxt')
const consola = require('consola')

/** Server Related */
const connect = require('connect')
const compression = require('compression')
const serveStatic = require('serve-static')

/** Server Modules */
const { errHandler } = require('./modules/helpers')

/** See if we're running in Node Development Mode */
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

/**************************************
 * Route Handlers
 **************************************/

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
    html /** (null|String) */,
    error /** (null|Object) */,
    redirected /** (false|Object) */
  } = await nuxt.renderRoute(req.url).catch(err => {
    consola.error(`Nuxt render error - ${err} || Stack:: ${err.stack}`)
    res.redirect('/404.html')
  })

  /** Do something with the rendered route */
  if (html) {
    res.send(html)
  } else if (redirected) {
    consola.info(`Nuxt renderRoute Redirect: ${redirected.path}`)
    res.redirect(path.join(__dirname, redirected.path))
  } else if (error) {
    consola.info(`Nuxt renderRoute Error: ${req.path} --error-- ${error}`)
    isDev
      ? res.send(`Nuxt renderRouter Error: ${error}`)
      : res.redirect(path.join(__dirname, '/404.html'))
  }
}

/**************************************
 * Connect Server App
 **************************************/
const app = connect()
app.use(compression())

/* Handle Caught errors from Helpers.asyncErrorCatcher() **/
app.use((err, req, res, next) => {
  consola.info(`Application Error: ${err.stack}`)
  isDev
    ? res.json({
        Error:
          'An Application Error has occured, please see the server logs for details'
      })
    : res.redirect(path.join(__dirname, '/404.html'))
})

/**
 * Serve Static Assets
 * FYI: the client (hosting server) isn't actually required to have any files on it
 * This would, in theory, allow us to host the entire website through firebase functions
 * although in practice this is ill-advised due to long load times and function server invocations
 * Try: Deleting everything from the prod/client folder EXCEPT for the service worker (sw.js)
 * and observe how that affects load times
 */
app.use(serveStatic(path.join(__dirname, 'nuxt', 'dist')))
app.use(serveStatic(path.join(__dirname, 'nuxt/dist/client/static')))
app.use('/assets/', serveStatic(path.join(__dirname, 'nuxt/dist/client')))

/** Nuxt Render */
app.use(
  '*',
  errHandler(async (req, res, next) => {
    await nuxt.render(req, res)
    next()
  })
)
/** Nuxt Render Route */
app.use(
  errHandler(async (req, res, next) => {
    await nuxtHandler(req, res)
    next()
  })
)

/** nuxtssr function exported for Firebase Functions */
exports.nuxtssr = functions.https.onRequest(app)
