const fs = require('fs')
const ejs = require('ejs')

require.extensions['.ejs'] = function (module) {
  var filename = module.filename
  var options = {filename: filename, client: true, compileDebug: true}
  var template = fs.readFileSync(filename, 'utf8')
  var fn = ejs.compile(template, options)
  var compiled =  module._compile('module.exports = ' + fn.toString() + ';', filename)

}
