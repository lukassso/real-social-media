import Vue from 'vue'
import App from './App.vue'
import router from './router/'


import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'api'

import VueRecaptcha from 'vue-recaptcha'
Vue.component('vue-recaptcha', VueRecaptcha)

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('v-icon', Icon)

import ParametersInput from '@/modules/api-explorer/components/ParametersInput.vue'
Vue.component('parameters-input', ParametersInput)

import "@/components/registerGlobal.js"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
