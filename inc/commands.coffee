chat = require './chat'
db   = require './db'

module.exports =
  add_for: (channel, regex, response) ->
    regex = regex.slice(1) if regex[0] == '!'
    db.union_with 'commands'+channel, {regex, response}
    chat.on(regex, -> chat.say_in channel response, channel)

  get_for: (channel) ->
    db.get 'commands'+channel

  remove_from: (channel, regex) ->
    db.remove_from_where 'commands'+channel, {regex}
    chat.sync_commands_for channel
