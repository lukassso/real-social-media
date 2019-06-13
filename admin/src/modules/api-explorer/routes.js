import Services from './views/Services.vue'
import Service from './views/Service.vue'
import Model from './views/Model.vue'
import ViewPage from './views/ViewPage.vue'
import Action from './views/Action.vue'

export default function(prefix) {
  return [
    {
      path: prefix+'/',
      name: 'api:services',
      component: Services
    },
    {
      path: prefix+'/:serviceName',
      name: 'api:service',
      component: Service,
      props: true,
    },
    {
      path: prefix+'/model/:serviceName/:modelName',
      name: 'api:model',
      component: Model,
      props: true
    },
    {
      path: prefix+'/view/:serviceName/:viewName',
      name: 'api:view',
      component: ViewPage,
      props: true
    },
    {
      path: prefix+'/action/:serviceName/:actionName',
      name: 'api:action',
      component: Action,
      props: true
    }
  ]

}
