db = require './db'

module.exports =
  channel:     db.get('config').username
  oauth_token: db.get('config').oauth_token
  username:    db.get('config').username
