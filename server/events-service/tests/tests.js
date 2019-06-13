const test = require('blue-tape')
const r = require('rethinkdb')
const testUtils = require('rethink-event-sourcing/tape-test-utils.js')
const crypto = require('crypto')

test('Events service', t => {
  t.plan(5)

  let conn

  testUtils.connectToDatabase(t, r, (connection) => conn = connection)

  const admin = { roles: ["admin"] }

  const oldEventData = {
    name: "test event name",
    description: "test event description",
    project: 2
  }

  const newEventData = {
    name: "test event name 2",
    description: "test event description 2",
    project: 1
  }

  let eventId

  t.test('create event', t => {
    t.plan(2)

    testUtils.runCommand(t, r, 'events', {
      type: 'EventCreate',
      client: admin,
      parameters: {
        ...oldEventData
      }
    }, (cId) => { }).then(
      result => {
        eventId = result
      }
    )

    t.test('check if event exists', t=> {
      t.plan(2)
      setTimeout(()=>{
        r.table('events_Event').get(eventId).run(conn).then(
          eventRow => {
            if(eventRow) t.pass('event exists')
              else t.fail('event not found')
            t.equals(eventRow.name, oldEventData.name, 'event display name match')
          }
        ).catch(t.fail)
      }, 450)
    })

  })

  t.test('update event', t => {
    t.plan(2)

    testUtils.runCommand(t, r, 'events', {
      type: 'EventUpdate',
      client: admin,
      parameters: {
        event: eventId,
        ...newEventData
      }
    }, (cId) => { }).then(
      result => {
      }
    )

    t.test('check if event name is changed', t => {
      t.plan(1)
      setTimeout( () => {
        r.table('events_Event').get(eventId).run(conn).then(
          event => {
            t.equals(event.name, newEventData.name, 'event display name match')
          }
        ).catch( t.fail )
      }, 250)
    })

  })

  t.test('remove event', t => {
    t.plan(2)

    testUtils.runCommand(t, r, 'events', {
      type: 'EventDelete',
      parameters: {
        event: eventId
      },
      client: admin
    }, (cId) => { }).then(
      result => {
      }
    )

    t.test('check if event not exists', t=> {
      t.plan(1)
      setTimeout(()=>{
        r.table('events_Event').get(eventId).run(conn).then(
          eventRow => {
            if(!eventRow) t.pass('event not exists')
              else t.fail('event still exists')
          }
        ).catch(t.fail)
      }, 250)
    })

  })

  t.test('close connection', t => {
    conn.close(() => {
      t.pass('closed')
      t.end()
    })
  })

})