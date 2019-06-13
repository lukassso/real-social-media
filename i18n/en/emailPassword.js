const env = require('../env.js')

module.exports = {

  loginForm: {
    title: 'Sign In',
    email: 'Email',
    password: 'Password',
    submit: 'Sing In',
    resetButton: "Reset password",
    resendButton: "Resend confirmation email.",
    errors: {
      notFound: 'Email not found in our database.',
      wrongPassword: 'Password does not match one stored in our database.',
      registrationNotConfirmed: 'Email registered but not confirmed.'
    },
    reset : {
      title: "Reset password",
      text: ({email}) => `We sent email to ${email} with special secret link and instructions to reset your password.`
    },
    resent : {
      title: "Resend email confirmation",
      text: ({email}) => `We sent email to ${email} with special secret link and instructions to confirm your email and activate your account.`
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

  resetPasswordEmail: ({email, key, user}) => ({
    from: 'Reall <system@reall.me>',
    to: `${user.display} <${email}>`,
    subject: 'Password reset request.',
    text: require('./email/resetPasswordEmail.text.ejs')({user, env, key}),
    html: require('./email/resetPasswordEmail.html.ejs')({user, env, key})
  }),

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
      text: "Your link has been used before."
    },
    expired : {
      title: "Reset password",
      text: "Your link expired."
    },
    notFound : {
      title: "Not found",
      text: "We could not find your link in our database. Please copy and paste address from email that your received."
    }
  },

  startEmailChange: {
    title: "Change email",
    newEmail: 'New email',
    currentPassword: 'Current password',
    submit: "Change email",
    errors: {
      wrongPassword: "Password does not match one stored in our database.",
      taken: "This email is already registered in our system."
    },
    done: {
      title: "Change email",
      text: ({email}) => `We sent a change confirmation link to your new email ${email}, when you click it, your email will be updated. The link will expire in 24 hours`
    }
  },

  changeEmailEmail: ({oldEmail, newEmail, key, user}) => ({
    from: 'Reall <system@reall.me>',
    to: `${user.display} <${newEmail}>`,
    subject: 'Email change request.',
    text: require('./email/changeEmailEmail.text.ejs')({user, env, key, newEmail}),
    html: require('./email/changeEmailEmail.html.ejs')({user, env, key, newEmail})
  }),

  finishEmailChange: {
    title: "Confirm email",
    done: {
      title: "Confirm email",
      text: "Email successfully changed.",
      exitButton: 'Ok'
    },
    loading : {
      title: "Confirm email",
      text: "Loading. please wait..."
    },
    used : {
      title: "Confirm email",
      text: "Your link has been used before."
    },
    expired : {
      title: "Confirm email",
      text: "Your link expired."
    },
    notFound : {
      title: "Not found",
      text: "We could not find your link in our database. Please copy and paste address from email that your received."
    }
  },

  registerEmail: ({ key, email, userData }) => ({
    from: 'Reall <system@reall.me>',
    to: `${userData.firstName} ${userData.lastName} <${email}>`,
    subject: 'Sing up.',
    text: require('./email/registerEmail.text.ejs')({user: userData, env, key}),
    html: require('./email/registerEmail.html.ejs')({user: userData, env, key})
  }),

  registerForm: {
    title: 'Sign up',
    email: 'Email',
    password: 'Password',
    retypePassword: 'Retype password',
    fullName: 'Full name',
    firstName: 'First name',
    lastName: 'Last name',
    phoneNumber:'Phone number',
    submit: 'Sing up',
    resendButton: "Resend confirmation email.",
    notMatch: "Passwords does not match!",
    errors: {
      alreadyAdded: 'Email already registered.',
      registrationNotConfirmed: 'Email registered but not confirmed.',
      noRecaptcha: 'Recaptcha is required'
    },
    resent : {
      title: "Resend email confirmation",
      text: ({email}) => `We sent email to ${email} with special secret link and instructions to confirm your email and activate your account.`
    },
    done : {
      title: 'Sign up',
      text: ({email}) => `We sent email to ${email} with special secret link and instructions to confirm your email and activate your account.`
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
      text: "Your link has been used before."
    },
    expired : {
      title: "Confirm sign up",
      text: "Your link expired."
    },
    notFound : {
      title: "Not found",
      text: "We could not find your link in our database. Please copy and paste address from email that your received."
    },
    resent : {
      title: "Resend email confirmation",
      text: "We sent email with special secret link and instructions to confirm your email."
    }
  }

}
