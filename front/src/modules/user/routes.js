import LoginEmail from '@/modules/user/emailPassword/LoginEmail.vue'
import Logout from '@/modules/user/user/Logout.vue'
import ResetPassword from '@/modules/user/emailPassword/ResetPasswordEmail.vue'
import ConfirmEmail from '@/modules/user/emailPassword/ConfirmEmail.vue'
import RegisterEmail from '@/modules/user/emailPassword/RegisterEmail.vue'
import ConfirmRegisterEmail from '@/modules/user/emailPassword/ConfirmRegisterEmail.vue'

import RegisterPhone from '@/modules/user/phonePassword/RegisterPhone.vue'
import LoginPhone from '@/modules/user/phonePassword/LoginPhone.vue'

import AccountSettings from '@/modules/user/AccountSettings.vue'
import Login from '@/modules/user/Login.vue'
import Register from '@/modules/user/Register.vue'


export default function(prefix) {
  return [
    {
      path: prefix+'/sign-in-email',
      name: 'emailPassword:login',
      component: LoginEmail,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/sign-up-email',
      name: 'emailPassword:register',
      component: RegisterEmail,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/confirm-sign-up-email/:key',
      name: 'emailPassword:confirm-register',
      component: ConfirmRegisterEmail
    },
    {
      path: prefix+'/reset-password/:key',
      name: 'emailPassword:reset-password',
      component: ResetPassword,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/change-email/:key',
      name: 'emailPassword:change-email',
      component: ConfirmEmail
    },


    {
      path: prefix+'/sign-up-sms',
      name: 'phonePassword:register',
      component: RegisterPhone,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/sign-in-sms',
      name: 'phonePassword:login',
      component: LoginPhone,
      meta: { requiresLogout: true }
    },

    {
      path: prefix+'/sign-in',
      name: 'user:login',
      component: Login,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/sign-up',
      name: 'user:register',
      component: Register,
      meta: { requiresLogout: true }
    },
    {
      path: prefix+'/user',
      name: 'user:account-settings',
      component: AccountSettings,
      meta: { requiresLogin: true }
    },
    {
      path: prefix+'/sign-out',
      name: 'user:logout',
      component: Logout
    },
  ]
}