_   = require 'underscore'
db = require './db'

module.exports =
  channel:     db.get('config').username
  channels:    _.union(db.get('config').username, db.get 'channels')
  oauth_token: db.get('config').oauth_token
  username:    db.get('config').username
