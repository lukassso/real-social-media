import CreateObject from "./CreateObject.vue"
import ViewObject from "./ViewObject.vue"
import UpdateObject from "./UpdateObject.vue"
import ObjectsList from "./ObjectsList.vue"

export default function(prefix) {
  return [
    {
      path: prefix+'/model/:service/:model',
      name: 'crud:model',
      component: ObjectsList,
      props: true
    },
    {
      path: prefix+'/model/create/:service/:model',
      name: 'crud:create',
      component: CreateObject,
      props: true
    },
    {
      path: prefix+'/model/view/:service/:model/:id',
      name: 'crud:view',
      component: ViewObject,
      props: true
    },
    {
      path: prefix+'/model/update/:service/:model/:id',
      name: 'crud:edit',
      component: UpdateObject,
      props: true
    },
  ]

}
