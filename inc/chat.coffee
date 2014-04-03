irc = require 'irc'
db  = require './db'
my  = require './my'
config = db.get 'config'

module.exports.connect_to = (chat_server) ->
  this.client = new irc.Client chat_server, my.username, {
      userName:   my.username,
      realName:   my.username,
      password:   my.oauth_token,
      channels:   ['#'+my.channel],
      debug:      true,
      showErrors: true
    }

module.exports.disconnect = ->
  this.client.disconnect

module.exports.join = (channel) ->
  this.client.join '#'+channel
  db.union_with 'channels', channel

module.exports.leave = (channel) ->
  this.client.part '#'+channel
  db.remove_from 'channels', channel

module.exports.say_in = (channel, message) ->
  this.client.say '#'+channel, message

# callback should take args (channel, user, match)
module.exports.on = (regex, callback) ->
  callback_wrapper = (user, channel, text) ->
    if regex.test text
      callback channel.slice(1), user, text.match regex
  this.client.addListener 'message#', callback_wrapper
