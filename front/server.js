process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'

const NativeModule = require('module')
const vm = require('vm')

const fs = require('fs')
const path = require('path')
const http = require('http')
const sockjs = require('sockjs')
const express = require('express')
const crypto = require('crypto')
const favicon = require('serve-favicon')
const compression = require('compression')
const serialize = require('serialize-javascript')
const cookie = require('cookie')
const LRUCache = require('lru-cache')
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

const app = express()


function parseTemplate (template) {
  const headMarker = '<!-- HEAD -->'
  const contentMarker = '<!-- APP -->'
  const headPosition = template.indexOf(headMarker)
  const contentPosition = template.indexOf(contentMarker)
  return {
    headTop: template.slice(0, headPosition),
    headBottom: template.slice(headPosition+headMarker.length, contentPosition),
    tail: template.slice(contentPosition + contentMarker.length)
  }
}

const template = parseTemplate(fs.readFileSync(resolve('./src/index.template.html'), 'utf-8'))


let serverBundle
let clientManifest

let renderer  // created from the webpack-generated server bundle
let reactiveServer  // definitions generated by renderer


if (isProd) {
  // in production: create server renderer and  HTML from real fs
  serverBundle = JSON.parse(fs.readFileSync(resolve('./dist/vue-ssr-server-bundle.json'), 'utf-8'))
  clientManifest = JSON.parse(fs.readFileSync(resolve('./dist/vue-ssr-client-manifest.json'), 'utf-8'))
  renderer = createRenderer(serverBundle, clientManifest, template)
  reactiveServer = createReactiveServer(bundle)
} else {
  // in development: setup the dev server with watch and hot-reload,
  // and update renderer / index HTML on file change.
  require('./build/setup-dev-server')(app, {
    serverBundleUpdated: bundle => {
      serverBundle = bundle
      reactiveServer = createReactiveServer(serverBundle)
      if(!clientManifest) return;
      renderer = createRenderer(serverBundle, clientManifest)
    },
    clientManifestUpdated: manifest => {
      clientManifest = manifest
      if(!serverBundle) return;
      renderer = createRenderer(serverBundle, clientManifest)
    }
  })
}




function createContext (context = {}) {
  const sandbox = {
    Buffer,
    clearImmediate,
    clearInterval,
    clearTimeout,
    setImmediate,
    setInterval,
    setTimeout,
    console,
    process,
    __VUE_SSR_CONTEXT__: context
  }
  sandbox.global = sandbox
  return sandbox
}

function createReactiveServer(bundle) {
  const context = createContext({
    /// input config? vars?
  })
  const wrapper = NativeModule.wrap(bundle.files[bundle.entry])
  const compiledWrapper = vm.runInNewContext(wrapper, context, {
    filename: '__vue_ssr_bundle__',
    displayErrors: true
  })
  const m = { exports: {}}
  compiledWrapper.call(m.exports, m.exports, require, m)
  const res = Object.prototype.hasOwnProperty.call(m.exports, 'default')
    ? m.exports.default
    : m.exports
  return res({
    /// input config? vars?
  })
}


function createRenderer (serverBundle, clientManifest, template) {
  return createBundleRenderer(serverBundle, {
    runInNewContext: true,
    clientManifest

    /*cache: new LRUCache({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })*/
  })
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use(favicon('static/icon.png'))
app.use('/service-worker.js', serve('./dist/service-worker.js'))
app.use('/manifest.json', serve('./manifest.json'))
app.use('/dist', serve('./dist'))
app.use('/static', serve('./static'))
//app.use('/content', serve(cmsServerSettings.contentDirectory))


app.get('*', (req, res) => {
  if (!renderer || !reactiveServer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  var cookies = cookie.parse(req.headers.cookie || '')

  if (cookies.sessionId) {
    processRequest(req, res, cookies)
  } else {
    genUuid((err, sessionId) => {
      if (err) {
        errorResponse(res, {
          error: err
        })
      } else {
        cookies.sessionId = sessionId
        console.log("GENERATED SID", cookies.sessionId)
        processRequest(req, res, cookies)
      }
    })
  }
})

function errorResponse(res, settings) {
  var error = settings.error || "unknown"
  console.log("ERROR:", error)
  var status = settings.status || 500
  res.writeHead(status)
  var name = settings.name || "Internal server error"

  res.end("<h1>"+status+" "+name+"</h1><p>Reason: " + error + "</p><hr><p>ReactiveDOM server</p>")
}

function genUuid(callback) {
  if (typeof(callback) !== 'function') {
    return uuidFromBytes(crypto.randomBytes(16))
  }
  crypto.randomBytes(16, function(err, rnd) {
    if (err) return callback(err)
    callback(null, uuidFromBytes(rnd))
  })
}
function uuidFromBytes(rnd) {
  rnd[6] = (rnd[6] & 0x0f) | 0x40
  rnd[8] = (rnd[8] & 0x3f) | 0x80
  rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/)
  rnd.shift()
  return rnd.join('-')
}

function getCallerIP(request) {
  var ip = request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  ip = ip.split(',')[0];
  ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  return ip;
}

function processRequest(req, res, cookies) {

  res.setHeader("Content-Type", "text/html");
  res.setHeader('Set-Cookie', 'sessionId='+cookies.sessionId)

  const s = Date.now()
  const ip = getCallerIP(req)

  console.log("DF",reactiveServer)
  const requestDao = reactiveServer.daoFactory(cookies.sessionId, req)

  const context = {
    url: req.url,
    dao: requestDao,
    sessionId: cookies.sessionId,
    ip: ip
  }
  renderer.renderToString(context, (err, html) => {
    if(err) {
      console.error("RENDERING ERROR", err)
      res.end(`<pre>${err.stack || err.code || err}</pre>`)
      return
    }
    const {
      title, htmlAttrs, bodyAttrs, link, style, script, noscript, meta
    } = context.meta.inject()
    if(!template) {
      res.write("Page loading, please refresh!")
      return
    }
    res.write(
        template.headTop
        + meta.text() + title.text() + link.text() + style.text() + script.text() + noscript.text()
        + context.renderResourceHints()
        + context.renderStyles()
        + template.headBottom)

    res.write(html)

    res.write(
        `<script>
          window.__INITIAL_STATE__= ${serialize(context.initialState, { isJSON: true })}
          window.__DAO_CACHE__= ${serialize(context.daoCache, { isJSON: true })}
          window.__SESSION_ID__= ${serialize(context.sessionId, { isJSON: true })}
        </script>` + context.renderScripts()
    )


    res.end(template.tail)

    console.log(`whole request: ${Date.now() - s}ms`)
  })
  /*
  const renderStream = renderer.renderToStream(context)
  renderStream.on('data', chunk => {
    res.write(chunk)
  })
  renderStream.on('end', () => {
    res.write(
      `<script>
        window.__INITIAL_STATE__= ${serialize(context.initialState, { isJSON: true })}
        window.__DAO_CACHE__= ${serialize(context.daoCache, { isJSON: true })}
        window.__SESSION_ID__= ${serialize(context.sessionId, { isJSON: true })}
        window.cmsSettings = ${serialize(cmsClientSettings, { isJSON: true })}
      </script>`
    )
    res.end(indexHTML.tail)
    console.log(`whole request: ${Date.now() - s}ms`)

    requestDao.dispose()
  })
  renderStream.on('error', err => {
    requestDao.dispose()
    if (err && err.code === '404') {
      res.status(404).end('404 | Page Not Found')
      return
    }
    // Render Error Page or Redirect
    res.status(500).end('Internal Error 500')
    console.error(`error during render : ${req.url}`)
    console.error(err)
  })
  */
}

const port = process.env.SSR_SERVER_PORT || 8001
var sockjs_server = sockjs.createServer({});
sockjs_server.on('connection', function(conn) {
  if(reactiveServer) reactiveServer.handleConnection(conn)
})
var server = http.createServer(app)
sockjs_server.installHandlers(server, { prefix: '/reactive-dao' })
server.listen(port)
console.log(`server started at localhost:${port}`)

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('Unhandled Promise Rejection', error.stack || error);
});