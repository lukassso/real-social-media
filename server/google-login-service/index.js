const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const rtcms = require("realtime-cms")
const {OAuth2Client} = require('google-auth-library');

const googClientId = process.env.GOOGLE_CLIENT_ID
const googClient = new OAuth2Client(googClientId)

const definition = rtcms.createServiceDefinition({
  name: "googleLogin",
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
    const ticket = await googClient.verifyIdToken({
      idToken: accessToken,
      audience: googClientId
    })
    const googUser = ticket.getPayload()
    console.log("GOOGLE USER", googUser)
    const existingLogin = await Login.get(googUser.sub)
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
        name: googUser.name,
        email: googUser.email,
        firstName: googUser.given_name,
        lastName: googUser.family_name,
        picture: googUser.picture
      }))

      emit("googleLogin", [{
        type: "LoginCreated",
        login: googUser.sub,
        data: {
          id: googUser.sub,
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
          type: "google",
          id: googUser.sub,
          goog: googUser
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
