import ReactiveDao from "reactive-dao"
import ReactiveSockJS from "reactive-dao-sockjs"

export default (sessionId) => new ReactiveDao(sessionId, {

  protocols: {
    'sockjs': ReactiveSockJS
  },

  connectionSettings: {
    queueRequestsWhenDisconnected: true,
    requestSendTimeout: 2300,
    requestTimeout: 10000,
    queueActiveRequestsOnDisconnect: false,
    autoReconnectDelay: 200,
    logLevel: 1,
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