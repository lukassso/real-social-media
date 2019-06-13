import ReactiveDao from "reactive-dao"
import ReactiveSockJS from "reactive-dao-sockjs"
import ReactiveDaoWebsocket from "reactive-dao-websocket"


function getIp(connection) {
   let ip = connection.headers['x-forwarded-for'] || connection.remoteAddress ||
      (connection.connection && connection.connection.remoteAddress)
  ip = ip.split(',')[0]
  ip = ip.split(':').slice(-1)[0] //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  return ip
}


export default (sessionId, connection) => {
  let ip = getIp(connection)
  return new ReactiveDao(sessionId, {

    remoteUrl: process.env.API_SERVER || "ws://localhost:8002/api/ws",

    protocols: {
      'ws': ReactiveDaoWebsocket.client
    },

    connectionSettings: {
      headers: {
        'X-forwarded-for': ip
      },
      queueRequestsWhenDisconnected: true,
      requestSendTimeout: 2300,
      requestTimeout: 10000,
      queueActiveRequestsOnDisconnect: false,
      autoReconnectDelay: 200,
      logLevel: 1//1,
      /*connectionMonitorFactory: (connection) =>
          new ReactiveDao.ConnectionMonitorPinger(connection, {
            pingInterval: 50,
            pongInterval: 200
          })*/
    },

    metadata: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },

    user: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    emailPassword: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    phonePassword: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    facebookLogin: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    googleLogin: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    session: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    geo: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },
    logs: {
      type: "remote",
      generator: ReactiveDao.ObservableValue
    },

    defaultRoute: {
      type: "remote",
      generator: ReactiveDao.ObservableList
    }

  })
}
