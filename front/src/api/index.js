import { ReactiveDaoProxy } from "reactive-dao"
import Vue from "vue";
import '../vueInit.js'

import createDao from "./create.js"
import { ReactiveCache } from "reactive-dao"

const api = new ReactiveDaoProxy()

import ReactiveDaoVue from 'reactive-dao-vue'
Vue.use(ReactiveDaoVue, {
  dao: api
})

if(typeof window != 'undefined') {
  let cache = new ReactiveCache();
  cache.mode = 'load'
  cache.dao = createDao(window.__SESSION_ID__)
  cache.setCache(window.__DAO_CACHE__)

  api.setDao(cache)

} else {
  api.mode = 'save'
}

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


console.log("API SESSION", api.session.session)



export default api
