argv   = require './inc/argv'
chat   = require './inc/chat'
db     = require './inc/db'
my     = require './inc/my'
quotes = require './inc/quotes'
todo   = require './inc/todo'
wizard = require './inc/wizard'

if wizard.is_necessary or argv.has /--setup/
  wizard.run()
else
  chat.connect_to 'irc.twitch.tv'

  chat.on /^!(housebot|help|commands)$/, (channel, user, text) ->
    chat.say_in channel, 'Commands: !quote, !addquote, !todo, !mitosis'
    if channel == user
      chat.say_in channel, 'Owner commands: !seppuku'

  chat.on /^!quote$/, (channel, user, match) ->
    chat.say_in channel, quotes.random_from channel

  chat.on /^!addquote (.*)$/, (channel, user, match) ->
    quotes.submit_for channel, match[1]
    chat.say_in channel, 'Your quote has been added for review!'

  chat.on /^!mitosis$/, (channel, user, match) ->
    chat.join user
    chat.say_in channel, 'Splitting into '+user+' :D'

  chat.on /^!seppuku$/, (channel, user, match) ->
    chat.leave user

  chat.on /^!sms$/, (channel, user, match) ->
    chat.say_in channel, 'http://bombch.us/Ut'

  chat.on /^!todo (.*)$/, (channel, user, match) ->
    todo.add_to channel, match[1]
    chat.say_in channel, 'Todo list updated!'

  chat.on /^!todo$/, (channel, user, match) ->
    chat.say_in channel, todo.list_for channel
