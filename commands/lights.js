request = require('node-request-caching');

var strobeCount = 8;
var numFlips = 0;
var lights_owner = 'housebot';

var stream = function (user, callback) {
  request.get('https://api.twitch.tv/kraken/streams/'+lights_owner, {}, 600, function (error, response, body) {
    callback(JSON.parse(body).stream);
  });
};

var votes = {
  on: 0,
  off: 0,
  strobe: 0
};

var triggers = {
  on: function(bot, channel, devices) {
    numFlips++;
    bot.say(channel, 'Lights turning on! (flip #'+numFlips+')');
    devices[3].turn_on();
  },
  off: function(bot, channel, devices) {
    numFlips++;
    bot.say(channel, 'Lights turning off! (flip #'+numFlips+')');
    devices[3].turn_off();
  },
  strobe: function(bot, channel, devices) {
    numFlips += strobeCount * 2;
    bot.say(channel, 'Lights on strobe!');
    for (var i = 0; i < strobeCount; i++) {
      setTimeout(devices[3].turn_off, i * 1000);
      setTimeout(devices[3].turn_on,  i * 1000 + 500);
    }
  }
};

module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: /^lights( (on|off|strobe))?$/.test(argv.join(' ')) && options.channel.slice(1) === lights_owner,
    run: function() {
      if (!options.devices[3]) {
        options.bot.say(options.channel, 'I\'m not hooked up to any lights right now!');
        return;
      }
      if (argv.length === 1) {
        options.bot.say(options.channel, 'Commands for lights: !lights on, !lights off, !lights strobe');
        return;
      }
      if (argv[1].match(/on|off|strobe/)) {
        stream(options.channel.slice(1), function(stream) {
          if (stream !== null) {
            votes[argv[1]]++;
            if (votes[argv[1]] >= stream.viewers * .1) {
              triggers[argv[1]]();
            };
          }
        });
      }
    }
  };
};
