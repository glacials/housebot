ask = require './ask'
db  = require './db'

module.exports =

  is_necessary:
    db.get('config') == null

  run: ->
    ask.question(
      'What Twitch username should Housebot use? ',
      (username) -> ask.question(
        'What is the OAuth token for this account? ',
        (oauth_token) ->
          db.set 'config', {username, oauth_token}
          console.log 'Okay, configuration set! Now restart me.'
          process.exit()
      )
    )
