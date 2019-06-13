import ReactiveDao from "reactive-dao"
import ReactiveSockJS from "reactive-dao-sockjs"
import Vue from 'vue'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
}

let sessionId = localStorage.sessionId
if(!sessionId) {
  sessionId = guid()
  localStorage.sessionId = sessionId
}
document.cookie = `sessionId=${sessionId}`

let api =  new ReactiveDao(sessionId, {

  remoteUrl: document.location.protocol + '//' + document.location.host + "/api/sockjs",

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

import ReactiveDaoVue from 'reactive-dao-vue'
Vue.use(ReactiveDaoVue, {
  dao: api
})

api.session = new Vue({
  reactive: {
    session: ['session', 'currentSession']
  },
  /*data: {
    session : null
  },*/
  computed: {
    loggedIn() {
      return this.session && !!this.session.user
    },
    roles() {
      return (this.session && this.session.roles) || []
    }
  },
  watch: {
    session(s) {
      console.log("API SESSION CHANGE", s)
    }
  },
  preFetch() {
    console.log("SESSION PREFETCH!!!")
    return api.get(['session', 'currentSession'])
  },
  beforeCreate() {
    console.log("SESS V BEFORE CREATE")
  },
  created() {
    console.log("SESS V CREATED")
  }

})

api.metadata = new Vue({
  reactive: {
    serviceDefinitions: ['metadata', 'serviceDefinitions']
  },
  computed: {},
  preFetch() {
    console.log("METADATA PREFETCH!!!")
    return api.get(['metadata', 'serviceDefinitions'])
  }
})

window.api = api

export default api
