_   = require 'underscore'
irc = require 'irc'
db  = require './db'
my  = require './my'

module.exports =

  connect_to: (chat_server) ->
    process.setMaxListeners 0
    this.client = new irc.Client chat_server, my.username, {
        userName:   my.username,
        realName:   my.username,
        password:   my.oauth_token,
        channels:   _.union(my.channel, db.get 'channels').map((channel) -> '#'+channel)
        debug:      true,
        showErrors: true
      }

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
  on: (regex, callback) ->
    callback_wrapper = (user, channel, text) ->
      if regex.test text
        callback channel.slice(1), user, text.match regex
    this.client.addListener 'message#', callback_wrapper
