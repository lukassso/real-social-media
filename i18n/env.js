if(typeof window == 'undefined') {
  module.exports = {
    baseHref: process.env.BASE_HREF
  }
} else {
  module.exports = {
    baseHref: location.protocol + '//' +location.host
  }
}