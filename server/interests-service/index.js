const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const rtcms = require("realtime-cms")

const definition = require('./definition.js')

require('./interest.js')
require('./selectedInterests.js')

module.exports = definition

async function start() {
  rtcms.processServiceDefinition(definition, [ ...rtcms.defaultProcessors ])
  await rtcms.updateService(definition)//, { force: true })
  const service = await rtcms.startService(definition, { runCommands: true, handleEvents: true })
}

if (require.main === module) start().catch( error => { console.error(error); process.exit(1) })
