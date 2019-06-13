const test = require('blue-tape')
const r = require('rethinkdb')
const testUtils = require('rethink-event-sourcing/tape-test-utils.js')
const crypto = require('crypto')

test('sms service', t => {
  t.plan(4)

  let conn

  testUtils.connectToDatabase(t, r, (connection) => conn = connection)

  let testId = crypto.randomBytes(24).toString('hex')

  t.test('push sms event', t => {
    t.plan(1)

    testUtils.pushEvents(t, r, 'sms', [
      {
        type: "sent",
        testId,
        phone: '+48 517600482',
        text: 'Sms working!'
      }
    ])

  })

  t.test('wait for sms sent', t => {
    t.plan(1)
    t.timeoutAfter(5000)

    r.table("sms_events").filter({testId}).changes({include_initial:true}).run(conn).then(
      cursor => {
        if(! cursor) t.fail("no cursor")
        cursor.each((err, change) => {
          if(err) return cursor.close()
          let {new_val} = change
          if(new_val.sent) t.pass('sms sent!')
        })
      }
    )

  })


  t.test('close connection', t => {
    conn.close(() => {
      t.pass('closed')
      t.end()
    })
  })

})