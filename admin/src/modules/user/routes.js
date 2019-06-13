import LoginEmail from '@/modules/user/emailPassword/LoginEmail.vue'
import Logout from '@/modules/user/user/Logout.vue'


export default function(prefix) {
  return [
    {
      path: prefix+'/sign-in',
      name: 'emailPassword:login',
      component: LoginEmail,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/sign-out',
      name: 'user:logout',
      component: Logout
    }
  ]
}