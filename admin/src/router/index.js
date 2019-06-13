import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'

import apiExplorerRoutes from "../modules/api-explorer/routes.js"
import crudRoutes from "../modules/crud/routes.js"
import emailPasswordRoutes from "../modules/user/routes.js"

Vue.use(Router)

const router = new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    ...emailPasswordRoutes("/user"),
    ...apiExplorerRoutes("/api-explorer"),
    ...crudRoutes('/crud')
  ]
})


/*

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
            router.replace({ name: 'index' })
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
*/


export default router