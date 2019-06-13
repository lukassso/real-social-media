import Vue from "vue"


import LoadingZone from '@/components/LoadingZone.vue'
Vue.component('loading-zone', LoadingZone)
import Loading from '@/components/Loading.vue'
Vue.component('loading', Loading)


import WorkingZone from '@/components/WorkingZone.vue'
Vue.component('working-zone', WorkingZone)
import CommandForm from '@/components/CommandForm.vue'
Vue.component('command-form', CommandForm)
import FormFieldBind from "@/components/FormFieldBind.vue";
Vue.component('form-field-bind', FormFieldBind)

import "./fields/registerGlobal.js"
