const rtcms = require("realtime-cms")

module.exports = {
  type: Object,
  properties: {
    firstName: {
      type: String,
      validation: []
    },
    lastName: {
      type: String,
      validation: []
    }
  }
}