const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const rtcms = require("realtime-cms")
const validators = require("../validation")

const projects = rtcms.createServiceDefinition({
  name: "projects",
  eventSourcing: true,
  validators
})

const Group = projects.foreignModel('groups', 'Group')

const Project = projects.model({
  name: "Project",
  properties: {
    name: {
      type: String,
      validation: ['nonEmpty']
    },
    description: {
      type: String,
      validation: ['nonEmpty'],
      editor: 'textarea'
    },
    group: {
      type: Group,
      validation: ['nonEmpty'],
      editor: 'relationSingleSelect'
    },
    city: {
      type: String,
      validation: ['nonEmpty'],
      editor: 'projectCity'
    }
  },
  crud: {
    deleteTrigger: true,
    writeOptions: {
      access: (params, {client, service}) => {
        return client.roles.includes('admin')
      }
    }
  }
})

module.exports = projects

async function start() {
  rtcms.processServiceDefinition(projects, [ ...rtcms.defaultProcessors ])
  await rtcms.updateService(projects)//, { force: true })
  const service = await rtcms.startService(projects, { runCommands: true, handleEvents: true })
}

if (require.main === module) start().catch( error => { console.error(error); process.exit(1) })
