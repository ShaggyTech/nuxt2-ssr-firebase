'use strict'

// Wraps the routes to catch any errors that were bubbled up from the route async functions
const asyncErrorCatcher = fn => {
  return (req, res, next) => {
    const routePromise = fn(req, res, next)
    if (routePromise.catch) {
      routePromise.catch(err => next(err))
    }
  }
}

const Helpers = {
  asyncErrorCatcher
}

module.exports = Helpers
