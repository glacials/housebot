_      = require 'underscore'
argv   = require './inc/argv'
wizard = require './inc/wizard'

if wizard.is_necessary or argv.has /--setup/
  wizard.run()
else
  chat   = require './inc/chat'
  db     = require './inc/db'
  my     = require './inc/my'
  quotes = require './inc/quotes'
  todo   = require './inc/todo'

  chat.connect_to 'irc.twitch.tv'

  chat.on /^!(housebot|help|commands)$/, (channel, user) ->
    if channel == user
      chat.say_in channel, 'Owner commands: !review, !cleartodo'
    chat.say_in channel, 'Commands: !quote, !addquote, !todo. !mitosis to join your channel, !seppuku to leave it.'

  chat.on /^!quote$/, (channel) ->
    chat.say_in channel, quotes.random_from channel

  chat.on /^!addquote (.+)$/, (channel, user, match) ->
    quotes.submit_for channel, match[1]
    chat.say_in channel, 'Your quote has been added for review!'

  chat.on /^!mitosis$/, (channel, user, match) ->
    if chat.in user
      chat.say_in channel, 'I\'m already monitoring your channel, '+user+'! :D'
    else
      chat.join user
      chat.say_in channel, 'Splitting into '+user+' :D'

  chat.on /^!(seppuku|sudoku)$/, (channel, user) ->
    if channel == my.username
      chat.say_in channel, 'Leaving my channel could orphan me :('
    else
      if chat.in user
        chat.say_in channel, 'I will no longer guard '+user+' :('
        chat.leave user
      else
        chat.say_in channel, user+', I am not in your channel yet! :)'

  chat.on /^!sms$/, (channel) ->
    chat.say_in channel, 'http://bombch.us/Ut'

  chat.on /^!addcommand ([^ ]+) (.+)$/, (channel, user, match) ->
    if channel == user
      commands.add_for channel, match[1], match[2]

  chat.on /^!removecommand ([^ ]+)$/, (channel, user, match) ->
    if channel == user
      commands.remove_from channel, match[1]

  chat.on /^!todo$/, (channel) ->
    chat.say_in channel, todo.list_for channel

  chat.on /^!todo (.+)$/, (channel, user, match) ->
    todo.add_to channel, match[1]
    chat.say_in channel, 'Todo list updated!'

  chat.on /^!cleartodo$/, (channel, user) ->
    if channel == user
      todo.clear()
      chat.say_in channel, 'Todo list cleared!'

  chat.on /^!review$/, (channel, user) ->
    if channel == user
      if quotes.to_review_exist_in channel
        chat.say_in(channel, 'Review! Use !approve/!reject/!edit: '+quotes.first_pending_in channel)
      else
        chat.say_in channel, 'No quotes to review!'

  chat.on /^!approve$/, (channel, user) ->
    if channel == user
      quotes.approve_one_from channel
      if quotes.num_pending_in channel > 0
        chat.say_in channel, 'Approved! Next: '+quotes.first_pending_in channel
      else
        chat.say_in channel, 'Approved! No more left!'

  chat.on /^!reject$/, (channel, user) ->
    if channel == user
      quotes.reject_one_from channel
      if quotes.num_pending_in channel > 0
        chat.say_in channel, 'Rejected! Next: '+quotes.first_pending_in channel
      else
        chat.say_in channel, 'Rejected! No more left!'

  chat.on /^!edit$/, (channel, user) ->
    if channel == user
      chat.say_in channel, '!edit replaces the quote under review with one that you specify. Use it similarly to !addquote.'

  chat.on /^!edit (.+)$/, (channel, user, match) ->
    if channel == user
      quotes.reject_one_from channel
      quotes.add_for channel, match[1]
      if quotes.num_pending_in channel > 0
        chat.say_in channel, 'Edited and added! Next: '+quotes.first_pending_in channel
      else
        chat.say_in channel, 'Edited and added! No more left!'

  #db.get('channels').forEach chat.sync_commands_for
