_  = require 'underscore'
db = require './db'
hue = require 'node-hue-api'

bridge = db.get('hue')
hueApi = new hue.HueApi(bridge.ip, bridge.username)

votes = {}
votesRequired = 2
voters = {}

clearVotes = ->
  votes =
    on: 0,
    off: 0,
    flicker: 0
  voters = {}

clearVotes()

module.exports =

  vote_on: (user) ->
    if _.has(voters, user)
      return 'You already voted, ' + user + '. Wait until next vote.'
    voters[user] = true
    votes.on += 1

    if votes.on >= votesRequired
      clearVotes()
      hueApi.lights().then (result) ->
        result.lights.forEach (light) ->
          hueApi.setLightState light.id,
            on: true,
            brightness: 100
      return 'Lights coming on!'
    else
      return 'On votes: ' + votes.on + '/' + votesRequired

  vote_off: (user) ->
    if _.has(voters, user)
      return 'You already voted, ' + user + '. Wait until next vote.'
    voters[user] = true
    votes.off += 1

    if votes.off >= votesRequired
      clearVotes()
      hueApi.lights().then (result) ->
        result.lights.forEach (light) ->
          hueApi.setLightState light.id,
            off: true
      return 'Lights going out!'
    else
      return 'Off votes: ' + votes.off + '/' + votesRequired

  vote_flicker: (user) ->
    if _.has(voters, user)
      return 'You already voted, ' + user + '. Wait until next vote.'
    voters[user] = true
    votes.flicker += 1

    if votes.flicker >= votesRequired
      clearVotes()
      hueApi.lights().then (result) ->
        result.lights.forEach (light) ->
          hueApi.setLightState light.id,
            longAlert: true
      return 'Flicker time!'
    else
      return 'Flicker votes: ' + votes.flicker + '/' + votesRequired
