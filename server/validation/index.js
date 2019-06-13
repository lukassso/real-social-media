let clientSide = require('../../validation')

const reCAPTCHA=require('recaptcha2')

const recaptcha = new reCAPTCHA({
  secretKey: process.env.GRECAPTCHA_SECRET_KEY
})

const validators = {
  ...clientSide,

  /// Server side validations:

  recaptcha: (settings) => async (key) => {
    console.log("VALIDATE RECAPTCHA", key)
    return recaptcha.validate(key).then(result=>{
      console.log("RECAPTCHA", key, "VALID")
      return null
    }).catch(
      error => {
        console.error("RECAPTCHA ERROR", error)
        return "invalidKey"
      }
    )
  }
}


module.exports = validators
