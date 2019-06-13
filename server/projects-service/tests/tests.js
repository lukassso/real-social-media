const test = require('blue-tape')
const r = require('rethinkdb')
const testUtils = require('rethink-event-sourcing/tape-test-utils.js')
const crypto = require('crypto')

test('Projects service', t => {
  t.plan(5)

  let conn

  testUtils.connectToDatabase(t, r, (connection) => conn = connection)

  const admin = { roles: ["admin"] }

  const oldProjectData = {
    name: "test project name",
    description: "test project description",
    city: 'Katowice',
    group: 2
  }

  const newProjectData = {
    name: "test project name 2",
    description: "test project description 2",
    city: 'Warszawa',
    group: 1
  }

  let projectId

  t.test('create project', t => {
    t.plan(2)

    testUtils.runCommand(t, r, 'projects', {
      type: 'ProjectCreate',
      client: admin,
      parameters: {
        ...oldProjectData
      }
    }, (cId) => { }).then(
      result => {
        projectId = result
      }
    )

    t.test('check if project exists', t=> {
      t.plan(2)
      setTimeout(()=>{
        r.table('projects_Project').get(projectId).run(conn).then(
          projectRow => {
            if(projectRow) t.pass('project exists')
              else t.fail('project not found')
            t.equals(projectRow.name, oldProjectData.name, 'project display name match')
          }
        ).catch(t.fail)
      }, 450)
    })

  })

  t.test('update project', t => {
    t.plan(2)

    testUtils.runCommand(t, r, 'projects', {
      type: 'ProjectUpdate',
      client: admin,
      parameters: {
        project: projectId,
        ...newProjectData
      }
    }, (cId) => { }).then(
      result => {
      }
    )

    t.test('check if project name is changed', t => {
      t.plan(1)
      setTimeout( () => {
        r.table('projects_Project').get(projectId).run(conn).then(
          project => {
            t.equals(project.name, newProjectData.name, 'project display name match')
          }
        ).catch( t.fail )
      }, 250)
    })

  })

  t.test('remove project', t => {
    t.plan(2)

    testUtils.runCommand(t, r, 'projects', {
      type: 'ProjectDelete',
      parameters: {
        project: projectId
      },
      client: admin
    }, (cId) => { }).then(
      result => {
      }
    )

    t.test('check if project not exists', t=> {
      t.plan(1)
      setTimeout(()=>{
        r.table('projects_Project').get(projectId).run(conn).then(
          projectRow => {
            if(!projectRow) t.pass('project not exists')
              else t.fail('project still exists')
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