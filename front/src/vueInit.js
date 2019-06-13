/// This is dirty hack used to trick execution order

import Vue from 'vue'

import * as filters from './filters'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

import VueRecaptcha from 'vue-recaptcha'
Vue.component('vue-recaptcha', VueRecaptcha)

import "@/components/registerGlobal.js"


console.log("VUE INITIALIZED")
