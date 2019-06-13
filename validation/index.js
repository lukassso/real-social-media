

module.exports = {

  email: (settings) => (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(email).toLowerCase())) return "wrongEmail"
  },

  safePassword: (settings) => (pass) => {
    let digits = /\d/.test(pass)
    let lower = /[a-z]/.test(pass)
    let upper = /[A-Z]/.test(pass)
    let safe = pass.length >= 8 && digits && (lower || upper)
    if (pass.length >= 15) safe = true
    if (!safe) return "unsafePassword"
  },

  phone: (settings) => (phone) => {
    if (phone.match(/\d/g).length < 8) return "wrongPhone"
    if (!phone.match(/^[0-9 +-]{0,20}$/g)) return "wrongPhone"
  },

  recaptcha: (settings) => (code) => {
  },

  nonEmpty: (settings) => (value) => {
    console.log("NON EMPTY", value)
    if(!value) return 'empty'
    if(typeof value == 'string') {
      if(!value.trim()) return 'empty'
    }
    if(Array.isArray(value)) {
      if(value.length == 0) return 'empty'
    } else if(value instanceof Date) {
      return
    } if(typeof value == 'object') {
      if(Object.keys(value).length == 0) return 'empty'
    }
  }

}