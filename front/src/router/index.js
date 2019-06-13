import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import api from "api"

Vue.use(Router)
Vue.use(Meta)

import userRoutes from "../modules/user/routes.js"

import Index from '../views/Index.vue'
import SelectInterests from '../views/SelectInterests.vue'
import UserIndex from '../views/UserIndex.vue'

//console.log(userRoutes("/user"))

const routes = [
  { name:'index', path: '/', component: Index, meta: { requiresLogout: true } },
  { name:'selectInterests', path: '/select', component: SelectInterests },
  { name:'userIndex', path: '/home', component: UserIndex },
  ...userRoutes("/user")
]

function createRouter() {

  const router = new Router({
    mode: 'history',
    routes,
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })

  let redirectAfterLogin

  router.beforeEach((to, from, next) => {
    if(to.matched && to.matched[0] && to.matched[0].meta) {
      if (to.matched[0].meta.requiresLogin) {
        if (!api.session.loggedIn) {
          console.log("REDIRECT TO LOGIN!")
          redirectAfterLogin = to.fullPath
          next({
            name: 'user:login'
          })
          return
        }
      }
      if (to.matched[0].meta.requiresLogout) {
        if (api.session.loggedIn) {
          console.log("REDIRECT TO USER INDEX!")
          next({
            name: 'userIndex'
          })
          return
        }
      }
    }
    next()
  })

  let routerReactions = new Vue({
    data() { return {} },
    computed: {
      loggedIn() { return api.session.loggedIn }
    },
    watch: {
      loggedIn(v) {
        if(v) {
          console.log("LOGGED IN!")
          if(router.currentRoute.meta.requiresLogout) {
            if(redirectAfterLogin && typeof window != 'undefined') {
              router.replace(redirectAfterLogin)
            } else {
              router.replace({ name: 'userIndex' })
            }
          }
        } else {
          console.log("LOGGED OUT!")
          if(router.currentRoute.meta.requiresLogin) {
            redirectAfterLogin = router.currentRoute.fullPath
            router.replace({
              name: 'login'
            })
          }
        }
      }
    }
  })

  return router

}

export default createRouter
