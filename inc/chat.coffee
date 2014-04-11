_   = require 'underscore'
irc = require 'irc'
db  = require './db'
my  = require './my'

module.exports =

  connect_to: (chat_server) ->
    this.client = new irc.Client chat_server, my.username,
      userName:   my.username,
      realName:   my.username,
      password:   my.oauth_token,
      channels:   my.channels.map (channel) -> '#'+channel
      debug:      true,
      showErrors: true
    this.client.setMaxListeners 0

  disconnect: ->
    this.client.disconnect

  join: (channel) ->
    this.client.join '#'+channel
    db.union_with 'channels', channel

  leave: (channel) ->
    this.client.part '#'+channel
    db.remove_from 'channels', channel

  say_in: (channel, message) ->
    this.client.say '#'+channel, message

  in: (channel) ->
    _.contains(_.union(my.channel, db.get 'channels'), channel)

# callback should take args (channel, user, match)
  on: (regex, callback, channel) ->
    callback_wrapper = (user, channel, text) ->
      if regex.test text
        callback channel.slice(1), user, text.match regex
    if channel == null
      this.client.addListener 'message#', callback_wrapper
    else
      this.client.addListener 'message#'+channel, callback_wrapper

  sync_commands_for: (channel) ->
    this.client.removeAllListeners 'message#'+channel
    _.each(db.get 'commands'+channel, (command) ->
      this.client.addListener('message#'+channel, command.regex, chat.say_in(channel, command.response))
    )
