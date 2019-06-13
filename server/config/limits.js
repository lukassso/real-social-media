module.exports = [

  {
    action: "sendSms", // Działanie lub lista działań uwzględnianych w regule
    per: ['ip'], // dla czego będzie liczony limit
    limits: [{ // pojedynczy limit 1 na minutę
      interval: 1 * minute,
      count: 1,
      visible: true // czy pokazywać odliczanie użytkownikowi
    }]
  },

  {
    action: "badLogin",
    per: ['login'],
    limits: [{
      interval: Infinity,
      count: 3,
      limits: [
        {
          interval: 15 * minute,
          count: 3,
          visible: true
        },
        {
          duration: 15 * minute,
          interval: Infinity,
          count: 0,
          visible: true
        }
      ]
    }, {
      trigger: 'blockLoginMethod'
    }],
    clearAction: "login"
  }

]