import './vueInit.js'
import { createApp } from './app'

global.DOMParser = require('xmldom').DOMParser;
global.cmsSettings = {}

import createDao from './api/create'
import { ReactiveServer, ReactiveCache } from "reactive-dao"
import dao from './api'

dao.observable(['session','currentSession']).observe((...args) => console.log("currentSession <- ",...args))

const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.

async function render(context) {

  let {app, router, store} = createApp()

  let cache = new ReactiveCache()
  cache.mode = 'save'
  cache.dao = context.dao // injected dao from dao server

  dao.setDao(cache)

  const s = isDev && Date.now()

  // set router's location
  router.push(context.url)
  const matchedComponents = router.getMatchedComponents()

  // no matched routes
  if (!matchedComponents.length) {
    return Promise.reject({ code: '404' })
  }

  matchedComponents.push(dao.session.$options)
  matchedComponents.push(dao.metadata.$options)

  // Call preFetch hooks on components matched by the route.
  // A preFetch hook dispatches a store action and returns a Promise,
  // which is resolved when the action is complete and store state has been
  // updated.
  await Promise.all(matchedComponents.map(component => {
    if (component.preFetch) {
      return component.preFetch(store)
    }
  }))
  isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
  // After all preFetch hooks are resolved, our store is now
  // filled with the state needed to render the app.
  // Expose the state on the render context, and let the request handler
  // inline the state in the HTML response. This allows the client-side
  // store to pick-up the server-side state without having to duplicate
  // the initial data fetching on the client.
  context.initialState = null
  context.meta = app.$meta()
  context.daoCache = cache.cacheData()

  console.dir(cache.cacheData())

  //console.log("PRE-FETCH CACHE", context.daoCache)
  return app
}

export default context  =>  {
  if(context.cmsServerSettings) {
    global.cmsSettings = context.cmsServerSettings
  }
  if(!context.url) { /// API SERVER ONLY
    console.log("CREATE REACTIVE SERVER!")
    return new ReactiveServer(createDao)
  }

  return render(context)
}
