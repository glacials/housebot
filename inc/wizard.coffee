ask = require './ask'
yesno = require 'yesno'
hue = require 'node-hue-api'
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
          yesno.ask 'Do you want Housebot to control your Philips Hue? (Y/n)',
            true,
            (ok) ->
              if ok
                hue.upnpSearch(2000).then (bridges) ->
                  db.set 'hue',
                    id: bridges[0].id,
                    ip: bridges[0].ipaddress

                  console.log 'Hue bridge found at ' + db.get('hue').ip + '.'
                  yesno.ask 'Go press the big button on the Hue bridge. Did you press it? (Y/n)',
                    true,
                    (ok) ->
                      (new hue.HueApi()).registerUser(db.get('hue').ip, 'housebot').then (username) ->
                        bridge = db.get 'hue'
                        bridge.username = username
                        db.set 'hue', bridge

                        yesno.ask 'Registered with Hue bridge. Want me to do a test flicker? (Y/n)',
                          true,
                          (ok) ->
                            if ok
                              bridge = db.get('hue')
                              hueApi = new hue.HueApi bridge.ip, bridge.username

                              hueApi.lights().then (result) ->
                                result.lights.forEach (light) ->
                                  hueApi.setLightState(light.id, hue.lightState.create().shortAlert()).fail (err) ->
                                    console.log err
                                  .done()
                                console.log 'I just flickered all your lights. If you did not see anything,
                                something is not working. If you saw the flicker, then setup is complete.'
                                process.exit()
                      .fail (err) ->
                        if err.message == 'link button not pressed'
                          console.log 'Go press the big button on the Hue bridge, then come back here and press enter.'
                        else
                          console.log err
                      .done()
                .done()
      )
    )
