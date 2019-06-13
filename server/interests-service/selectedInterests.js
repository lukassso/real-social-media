const r = require.main.rethinkdb || require('rethinkdb')
if (require.main === module) require.main.rethinkdb = r

const definition = require("./definition.js")
const { Interest } = require("./interest.js")

const Session = definition.foreignModel('session', 'Session')
const User = definition.foreignModel('users', 'User')

const SelectedInterests = definition.model({
  name: 'SelectedInterests',
  properties: {
    user: {
      type: User,
      index: true
    },
    session: {
      type: Session,
      index: true
    },
    interests: {
      type: Array,
      of: {
        type: Interest
      }
    }
  }
})

definition.view({
  name: "MySelectedInterests",
  properties: {},
  returns: {
    type: null
  },
  rawRead: true,
  async read(props, { client }, method) {
    const id = client.user ? "user_"+client.user : "session_"+client.sessionId
/*    await SelectedInterests.run(
        SelectedInterests.table.insert({ id: session, session, interests: [] }, {
          conflict: (id, oldDoc, newDoc) => ({
            session,
            interests: oldDoc('interests').merge(newDoc('interests'))
          })
        })
    )*/
    if(method == "get") {
      return SelectedInterests.table.get(id).default({interests: []})('interests')
    } else {
      return SelectedInterests.table.get(id).changes({ includeInitial: true }).map(change => ({
        old_val: change('old_val').default({ interests:[] })("interests"),
        new_val: change('new_val').default({ interests:[] })("interests")
      }))
    }
  }
})

definition.event({
  name: "interestSelected",
  async execute({ interest, ident, user, session }) {
    await SelectedInterests.run(
      SelectedInterests.table.insert({ id: ident, user, session, interests: [interest] }, {
        conflict: (id, oldDoc, newDoc) => newDoc.merge({
          interests: oldDoc('interests').append(interest)
        })
      })
    )
  }
})

definition.event({
  name: "interestDeselected",
  async execute({ interest, ident }) {
    await SelectedInterests.run(
      SelectedInterests.table.get(ident).update( row => ({
        interests: row("interests").filter(function (item) { return item.ne(interest) })
      }))
    )
  }
})

definition.event({
  name: "interestsUpdated",
  async execute({ interests, user, session, ident }) {
    await SelectedInterests.run(
        SelectedInterests.table.insert( {id: ident, user, session, interests : interests}, { conflict:'update' })
    )
  }
})

definition.action({
  name: "SelectInterest",
  properties: {
    interest : {
      type: Interest
    }
  },
  async execute({ interest }, { client }, emit) {
    const id = client.user ? "user_"+client.user : "session_"+client.sessionId
    emit([{
      type: "interestSelected",
      user: client.user || null,
      session: client.sessionId || null,
      ident: id,
      interest: interest
    }])
    return null
  }
})

definition.action({
  name: "DeselectInterest",
  properties: {
    interest : {
      type: Interest
    }
  },
  async execute({ interest }, { client }, emit) {
    const id = client.user ? "user_"+client.user : "session_"+client.sessionId
    emit([{
      type: "interestDeselected",
      user: client.user || null,
      session: client.sessionId || null,
      ident: id,
      interest: interest
    }])
    return null
  }
})

definition.trigger({
  name: "OnLogin",
  properties: {
    user: {
      type: User
    },
    session: {
      type: Session
    }
  },
  async execute({ user, session }, context, emit) {
    const userId = "user_"+user
    const sessionId = "session_"+session
    const [userInterests, sessionInterests] = await Promise.all([
        SelectedInterests.get(userId), SelectedInterests.get(sessionId)
    ])
    const previousInterests = userInterests ? userInterests.interests || [] : []
    const moreInterests = (sessionInterests ? sessionInterests.interests || [] : [])
        .filter(interest => !previousInterests.find(i => i == interest)) // remove duplicates

    const allInterests = previousInterests.concat(moreInterests)

    emit([{
      type: "interestsUpdated",
      ident: userId,
      user, session,
      interests: allInterests
    }])
  }
})

definition.trigger({
  name: "OnRegisterStart",
  properties: {
    user: {
      type: User
    },
    session: {
      type: Session
    }
  },
  async execute({ user, session }, context, emit) {
    const userId = "user_"+user
    const sessionId = "session_"+session
    const [userInterests, sessionInterests] = await Promise.all([
        SelectedInterests.get(userId), SelectedInterests.get(sessionId)
    ])
    const previousInterests = userInterests ? userInterests.interests || [] : []
    const moreInterests = (sessionInterests ? sessionInterests.interests || [] : [])
        .filter(interest => !previousInterests.find(i => i == interest)) // remove duplicates

    const allInterests = previousInterests.concat(moreInterests)

    emit([{
      type: "interestsUpdated",
      ident: userId,
      user, session,
      interests: allInterests
    }])
  }
})