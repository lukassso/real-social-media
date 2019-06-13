const env = require('../env.js')

module.exports = {

  loginForm: {
    title: 'Sign In',
    phone: 'phone',
    password: 'Password',
    submit: 'Sing In',
    resetButton: "Reset password",
    resendButton: "Resend confirmation phone.",
    errors: {
      notFound: 'Phone number not found in our database.',
      wrongPassword: 'Password does not match one stored in our database.',
      registrationNotConfirmed: 'Phone number registered but not confirmed.'
    },
    reset : {
      title: "Reset password",
      text: ({phone}) => `We sent sms to ${phone} with code, please enter code to reset password.`
    },
    resent : {
      title: "Resend phone confirmation",
      text: ({phone}) => `We sent sms to ${phone} with code, please enter code to confirm your phone number and activate your account.`
    },
    registerText: "If you don't have account, ",
    registerLink: "Click here to create one"
  },

  changePassword: {
    title: "Change password",
    oldPassword: "Current password",
    newPassword: "New password",
    retypePassword: "Retype new password",
    notMatch: "Passwords does not match!",
    submit: "Change password",
    errors: {
      wrongPassword: "Old password does not match one stored in our database."
    },
    done: {
      title: "Change password",
      text: "Password successfully changed."
    }
  },

  resetPasswordSms: ({phone, code, user}) => require('./sms/resetPasswordSms.ejs')({user, phone, code}),

  resetPassword: {
    title: "Reset password",
    newPassword: "New password",
    retypePassword: "Retype new password",
    notMatch: "Passwords does not match!",
    submit: "Change password",
    errors: {
    },
    done: {
      title: "Reset password",
      text: "Password successfully changed.",
      loginButton: 'Sign In'
    },
    loading : {
      title: "Reset password",
      text: "Loading. please wait..."
    },
    used : {
      title: "Reset password",
      text: "Your code has been used before."
    },
    expired : {
      title: "Reset password",
      text: "Your code expired."
    },
    notFound : {
      title: "Not found",
      text: "We could not find your code in our database. Please copy and paste code from sms that your received."
    }
  },

  startPhoneChange: {
    title: "Change phone",
    newPhone: 'New phone',
    currentPassword: 'Current password',
    submit: "Change phone",
    errors: {
      wrongPassword: "Password does not match one stored in our database.",
      taken: "This phone is already registered in our system."
    },
    done: {
      title: "Change phone",
      text: ({phone}) => `We sent a code to your new phone ${phone}, enter the code to update your phone number.`
    }
  },

  changePhoneSms: ({phone, code, user}) => require('./sms/changePhoneSms.ejs')({user, phone, code}),

  finishPhoneChange: {
    title: "Confirm phone",
    done: {
      title: "Confirm phone",
      text: "phone successfully changed.",
      exitButton: 'Ok'
    },
    loading : {
      title: "Confirm phone",
      text: "Loading. please wait..."
    },
    used : {
      title: "Confirm phone",
      text: "Your code has been used before."
    },
    expired : {
      title: "Confirm phone",
      text: "Your code expired."
    },
    notFound : {
      title: "Not found",
      text: "We could not find this code in our database. Please copy and paste code from sms that your received."
    }
  },


  registerSms: ({phone, code, user}) => require('./sms/registerSms.ejs')({user, phone, code}),

  registerForm: {
    title: 'Sign up',
    phone: 'phone',
    password: 'Password',
    retypePassword: 'Retype password',
    fullName: 'Full name',
    firstName: 'First name',
    lastName: 'Last name',
    phoneNumber:'Phone number',
    submit: 'Sing up',
    resendButton: "Resend confirmation sms.",
    notMatch: "Passwords does not match!",
    errors: {
      alreadyAdded: 'phone already registered.',
      registrationNotConfirmed: 'Phone number registered but not confirmed.',
      noRecaptcha: 'Recaptcha is required'
    },
    resent : {
      title: "Resend phone confirmation",
      text: ({phone}) => `We sent sms to ${phone} with special secret link and instructions to confirm your phone and activate your account.`
    },
    done : {
      title: 'Sign up',
      text: ({phone}) => `We sent sms to ${phone} with special secret link and instructions to confirm your phone and activate your account.`
    },
    passwordTooSimple: "Password is too weak, enter password with at least 8 characters, upper & lower case letters and numbers"
  },

  finishRegister: {
    title: "Confirm sign up",
    registerLink: "Click here to create new account",
    done: {
      title: "Confirm sign up",
      text: "Your account was successfully created. You will be logged in.",
      exitButton: 'Ok'
    },
    loading : {
      title: "Confirm sign up",
      text: "Loading. please wait..."
    },
    used : {
      title: "Confirm sign up",
      text: "Your code has been used before."
    },
    expired : {
      title: "Confirm sign up",
      text: "Your code expired."
    },
    notFound : {
      title: "Not found",
      text: "We could not find your cpde in our database. Please copy and paste code that your received."
    },
    resent : {
      title: "Resend sms confirmation",
      text: "We sent sms with code to confirm your phone."
    }
  }

}
