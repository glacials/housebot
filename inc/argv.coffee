module.exports.has = (regex) ->
  regex.test process.argv.join(' ')
