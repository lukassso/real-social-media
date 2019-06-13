const r = require('rethinkdb')
const nodemailer = require('nodemailer')
const evs = require('rethink-event-sourcing')({
  serviceName: 'sms'
})


const SMSAPI = require('smsapi')
const smsapi = new SMSAPI({
  oauth: {
    accessToken: process.env.SMSAPI_ACCESS_TOKEN
  }
})

evs.registerEventListeners({

  sent({ id, phone, text, sent }) {
    if(sent) return; // anti resent solution

    return new Promise((resolve, reject) => {
      smsapi.message
        .sms()
        .from('Eco')
        .dataEncoding('utf8')
        .to(phone)
        .message(text)
        .execute()
        .then( info => {
          return r.table("sms_events").get(id).update({
            sent: true,
            sentTime: new Date(),
            sentResult: info
          }).run(evs.db)
        })
        .catch((error) => {
          return r.table("sms_events").get(id).update({
            smsError: error
          }).run(evs.db).then(
              result => reject("sendFailed")
          )
        })
    })
  }

})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

