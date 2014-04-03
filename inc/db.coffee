_             = require 'underscore'
json_storage  = require('json-storage').JsonStorage
local_storage = require('node-localstorage').LocalStorage

db = json_storage.create(new local_storage('./db'), false);

module.exports =

  get: (key) -> db.get(key)
  set: (key, value) -> db.set(key, value)

  concat: (key, value) ->
    db.set(key, this.get(key).concat(value))

  union_with: (key, value) ->
    db.set(key, _.union(this.get(key) or [], value))

  remove_from: (key, value) ->
    db.set(key, _.without(this.get(key) or [], value))
