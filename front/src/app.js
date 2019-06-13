import './vueInit.js'

import Vue from 'vue'

import App from './App.vue'
import createRouter from './router'

require('analytics')

function createApp() {
  const router = createRouter()

  const app = new Vue(Vue.util.extend({
    router
  }, App))

  const store = null

  return { app, router, store }
}

export { createApp }
