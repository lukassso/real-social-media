const ReactiveDao = require("reactive-dao")
const maxmind = require('maxmind')
const csc = require("country-state-city").default

let countryDatabase = maxmind.open(process.env.GEOIP_COUNTRY_PATH)

//countryDatabase.then( db => console.log("COUNTRY DB", db))
countryDatabase.catch(err => console.error('COUNTRY DB ERROR', err))

function getGeoIp(ip) {
  return countryDatabase.then(db => {
    let result = db.get(ip)
    if(result == null) return 'unknown'
    return result.country.iso_code
  }).catch(error => {console.error("GEOIP",ip, error); return null })
}

async function getCitiesByCountry(countryCode) {
  let country = csc.getAllCountries().find(
      country => country.sortname.toUpperCase() == countryCode.toUpperCase()
  )
  let states = csc.getStatesOfCountry(country.id)
  let cities = [].concat(...states.map(state => csc.getCitiesOfState(state.id))).map(c => c.name)
  return cities
}

module.exports = function(sessionId, ip) {
  return new ReactiveDao.SimpleDao({
    values: {
      country: {
        get: () => getGeoIp(ip),
        observable: () => getGeoIp(ip).then(value => new ReactiveDao.ObservableValue(value))
      },
      citiesByCountry: {
        get: (countryCode) => getCitiesByCountry(countryCode),
        observable: (countryCode) => getCitiesByCountry(countryCode)
            .then( value => new ReactiveDao.ObservableValue(value))
      }
    },
    methods: {}
  })
}