const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const rtcms = require("realtime-cms")
const validators = require("../validation")

const events = rtcms.createServiceDefinition({
  name: "events",
  eventSourcing: true,
  validators
})

const Project = events.foreignModel('projects', 'Project')

const Event = events.model({
  name: "Event",
  properties: {
    title: {
      type: String,
      validation: ['nonEmpty']
    },
    time: {
      type: Date,
      validation: ['nonEmpty']
    },
    to: {
      type: String,
      validation: ['nonEmpty'],
      editor: 'time'
    },
    description: {
      type: String,
      validation: ['nonEmpty'],
      editor: 'textarea'
    },
    project: {
      type: Project,
      validation: ['nonEmpty'],
      editor: 'relationSingleSelect'
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

module.exports = events

async function start() {
  rtcms.processServiceDefinition(events, [ ...rtcms.defaultProcessors ])
  await rtcms.updateService(events)//, { force: true })
  const service = await rtcms.startService(events, { runCommands: true, handleEvents: true })
}

if (require.main === module) start().catch( error => { console.error(error); process.exit(1) })
