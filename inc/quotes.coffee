_  = require 'underscore'
db = require './db'

module.exports.submit_for = (channel, quote) ->
  db.union_with 'pending_quotes'+channel, quote

module.exports.random_from = (channel) ->
  quotes = db.get('quotes'+channel) or ['No quotes yet!']
  quotes[_.random 0, quotes.length - 1]
