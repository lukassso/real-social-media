const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const rtcms = require("realtime-cms")
const { Facebook } = require("fb")

const fb = new Facebook({
  appId: process.env.FACEBOOK_APP_ID,
  appSecret: process.env.FACEBOOK_APP_SECRET
})

const definition = rtcms.createServiceDefinition({
  name: "facebookLogin",
  eventSourcing: true
})

const User = definition.foreignModel("users", "User")

const Login = definition.model({
  name: "Login",
  properties: {
    name: {
      type: String
    },
    id: {
      type: String
    },
    email: {
      type: String
    },
    user: {
      type: User
    }
  },
  crud: {}
})

definition.action({
  name: "registerOrLogin",
  properties: {
    accessToken: {
      type: String
    }
  },
  returns: {
    type: User,
    idOnly: true
  },
  async execute({ accessToken }, { client, service }, emit) {
    const fbUser = await fb.api('/me', {
      fields: ['id', 'name', 'email', 'first_name', 'last_name', 'middle_name', 'short_name'],
      access_token: accessToken
    })
    console.log("fbUser", fbUser)
    const existingLogin = await Login.get(fbUser.id)
    if(existingLogin) { /// Login
      let userRow = await User.get(existingLogin.user)
      if(!userRow) throw service.error("internalServerError")
      emit("session", [{
        type: "loggedIn",
        user: existingLogin.user,
        session: client.sessionId,
        expire: null,
        roles: userRow.roles || []
      }])
      return existingLogin.user
    } else { // Register
      const user = rtcms.generateUid()
      let userData = JSON.parse(JSON.stringify({
        name: fbUser.name,
        email: fbUser.email,
        firstName: fbUser.first_name,
        lastName: fbUser.last_name,
        middleName: fbUser.middle_name,
        shortName: fbUser.short_name,
        gender: fbUser.gender
      }))

      emit("facebookLogin", [{
        type: "LoginCreated",
        login: fbUser.id,
        data: {
          id: fbUser.id,
          user,
          ...userData
        }
      }])
      emit("users", [{
        type: "UserCreated",
        user,
        data: {
          userData
        }
      },{
        type: "loginMethodAdded",
        user,
        method: {
          type: "facebook",
          id: fbUser.id,
          fb: fbUser
        }
      }])
      emit("session", [{
        type: "loggedIn",
        user,
        session: client.sessionId,
        expire: null,
        roles: []
      }])
      await service.trigger({
        type: "OnLogin",
        user,
        session: client.sessionId
      })

      return user
    }
  }

})

definition.action({
  name: "removeConnection", // override CRUD operation
  properties: {},
  returns: {
    type: User,
    idOnly: true
  },
  async execute({ }, { client, service }, emit) {
    if(!client.user) throw new service.error("notAuthorized")
    const user = client.user
    const cursor = await Login.run(Login.table().filter({ user }))
    if(!cursor) service.error("notFound")
    let results = await cursor.toArray()
    if(results.length == 0) throw service.error("notFound")
    let events = []
    for(let row of results) {
      events.push({
        type: "LoginRemoved",
        login: row.id
      })
    }
    emit("facebookLogin", events)
  }
})


definition.event({
  name: "UserDeleted",
  properties: {
    user: {
      type: User,
      idOnly: true
    }
  },
  async execute({ user }) {
    await Login.run(Login.table.filter({ user }).delete())
  }
})

definition.trigger({
  name: "OnUserDelete",
  properties: {
    user: {
      type: User,
      idOnly: true
    }
  },
  async execute({ user }, context, emit) {
    emit([{
      type: "UserDeleted",
      user
    }])
  }
})


module.exports = definition

async function start() {
  rtcms.processServiceDefinition(definition, [ ...rtcms.defaultProcessors ])
  await rtcms.updateService(definition)//, { force: true })
  const service = await rtcms.startService(definition, { runCommands: true, handleEvents: true })
}

if (require.main === module) start().catch( error => { console.error(error); process.exit(1) })
