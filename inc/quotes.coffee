_  = require 'underscore'
db = require './db'

module.exports =

  submit_for: (channel, quote) ->
    db.union_with 'pending_quotes'+channel, quote

  random_from: (channel) ->
    quotes = db.get('quotes'+channel) or ['No quotes yet!']
    _.sample quotes

  num_pending_in: (channel) ->
    (db.get('pending_quotes'+channel) or []).length

  to_review_exist_in: (channel) ->
    (db.get('pending_quotes'+channel) or []).length > 0

  first_pending_in: (channel) ->
    db.get('pending_quotes'+channel)[0]

  approve_one_from: (channel) ->
    quote = this.first_pending_in channel
    db.remove_from 'pending_quotes'+channel, quote
    db.union_with 'quotes'+channel, quote

  reject_one_from: (channel) ->
    db.remove_from 'pending_quotes'+channel, this.first_pending_in channel
