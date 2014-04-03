_  = require 'underscore'
db = require './db'

module.exports.add_to = (channel, item) ->
  db.union_with 'todo'+channel, item

module.exports.list_for = (channel) ->
  (db.get('todo'+channel) or ['No items to do!']).join ', '