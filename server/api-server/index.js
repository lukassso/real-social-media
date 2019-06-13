const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const ReactiveDao = require("reactive-dao")
const revs = require('rethink-event-sourcing')
const revsDao = require("reactive-dao-rethinkdb")
const http = require("http")
const express = require("express")
const sockjs = require('sockjs')
const WebSocketServer = require('websocket').server
const ReactiveDaoWebsocketServer = require("reactive-dao-websocket").server

const rtcms = require("realtime-cms")

const geoApi = require("./api/geoApi.js")

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

const serviceDefinitions = [
  require("../users-service"),
  require("../email-password-service"),
  require("../phone-password-service"),
  require("../facebook-login-service"),
  require("../google-login-service"),

  require("../interests-service"),
  require("../projects-service"),
  require("../events-service")
]

function local(credentials) {
  let { sessionId, ip } = credentials
  console.log("CLIENT IP", ip)
  return {
    session: new ReactiveDao.SimpleDao({
      values: {
        currentSession: revsDao.simpleValue(rtcms.connectToDatabase(), () => r.table("session").get(sessionId))
      },
      methods: {
        logout: () => rtcms.connectToDatabase().then(db =>
            revs.command(db, "session", "logout", {session: sessionId, ip}))
      }
    }),
    geo: geoApi(sessionId, ip)
  }
}
function remote(credentials) {
  return []
}

async function start() {

  let services = await Promise.all(serviceDefinitions.map(defn => {
    rtcms.processServiceDefinition(defn, [ ...rtcms.defaultProcessors ])
    return rtcms.startService(defn, {
      runCommands: false,
      handleEvents: false
    })
  }))

  const apiServer = await rtcms.createSessionApiServer({
    services: services,
    local,
    remote,
    shareDefinition: true
  })

  const app = express()

  const sockJsServer = sockjs.createServer({});
  sockJsServer.on('connection', function (conn) {
    console.log("SOCKJS connection")
    apiServer.handleConnection(conn)
  })

  const server = http.createServer(app)

  let wsServer = new WebSocketServer({ httpServer: server, autoAcceptConnections: false })
  wsServer.on("request",(request) => {
    console.log("WS URI", request.httpRequest.url)
    if(request.httpRequest.url != "/api/ws") return request.reject();
    let serverConnection = new ReactiveDaoWebsocketServer(request)
    apiServer.handleConnection(serverConnection)
  })

  const port = process.env.API_PORT || 5444
  server.listen(port)
  console.log('Listening on port ' + port)

  sockJsServer.installHandlers(server, {prefix: '/api/sockjs'})

}

start();
