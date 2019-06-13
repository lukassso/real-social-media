const definition = require("./definition.js")

const Interest = definition.model({
  name: "Interest",
  properties: {
    name: {
      type: String,
      validation: ['nonEmpty']
    },
    description: {
      type: String,
      validation: ['nonEmpty'],
      editor: 'textarea'
    }
  },
  display: ['name', 'country'],
  crud: {
    deleteTrigger: true,
    writeOptions: {
      access: (params, {client, service}) => {
        return client.roles.includes('admin')
      }
    }
  }
})

module.exports = { Interest }