const rtcms = require("realtime-cms")
const definition = require("./definition.js")

const User = definition.foreignModel("users", "User")

const passwordHash = require('../config/passwordHash.js')

const EmailPassword = definition.model({
  name: "EmailPassword",
  /// TODO: add queued by email
  properties: {
    email: {
      type: String,
      validation: ['email']
    },
    passwordHash: {
      type: String,
      preFilter: passwordHash,
      validation: ['safePassword']
    },
    user: {
      type: User
    }
  },
  crud: {}
})

const EmailKey = definition.model({
  name: "EmailKey",
  properties: {
    action: { type: String },
    used: { type: Boolean, defaultValue: false },
    email: { type: String },
    expire: { type: Number }
  }
})

module.exports = {
  User, EmailPassword, EmailKey
}