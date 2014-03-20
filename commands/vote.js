var votesRequired = 8;
var strobeCount = 8;
var numFlips = 0;

var polls = {
  lights: {
    on:  0,
    off: 0,
    strobe: 0
  }
}

var triggers = {
  lights: {
    on: function(bot, channel, devices) {
      numFlips++;
      bot.say(channel, 'Lights turning on! (flip #'+numFlips+')');
      devices[3].turn('on');
    },
    off: function(bot, channel, devices) {
      numFlips++;
      bot.say(channel, 'Lights turning off! (flip #'+numFlips+')');
      devices[3].turn('off');
    },
    strobe: function(bot, channel, devices) {
      numFlips += strobeCount * 2;
      bot.say(channel, 'Lights on strobe! Break out the glowsticks!');
      for (var i = 0; i < strobeCount; i++) {
        setTimeout(function() { devices[3].turn('off') }, i * 750);
        setTimeout(function() { devices[3].turn('on') },  i * 750 + 375);
      }
    }
  }
}

module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'vote',
    valid: (argv[0] === 'vote' || argv[0] === 'lights') &&
           (argv.length === 1) ||
           (argv.length === 2 && argv[1] in polls) ||
           (argv.length === 3 && argv[1] in polls && argv[2] in polls[argv[1]]),
    run: function() {
      if (!options.devices[3]) {
        options.bot.say(options.channel, "I'm not hooked up to any lights right now!");
        return;
      }
      var command   = argv[0];
      var pollName  = argv[1];
      var poll      = polls[pollName];
      var candidate = argv[2];
      if (argv.length === 1 && command === 'vote') {
        options.bot.say(options.channel, 'open polls → '+Object.keys(polls).join(' '));
      } else if (argv.length === 2 && poll) {
        response = 'candidates for '+argv[1]+' → '
        Object.keys(poll).forEach(function(option, numVotes, options) {
          response += option+' ';
        });
        options.bot.say(options.channel, response);
      } else if (argv.length === 3 && poll && candidate in poll) {
        poll[candidate]++;
        if (poll[candidate] >= votesRequired) {
          triggers[pollName][candidate](options.bot, options.channel, options.devices);
          Object.keys(poll).forEach(function(option, numVotes, options) {
            poll[option] = 0;
          });
        } else {
          options.bot.say(options.channel, pollName+' '+candidate+' → now '+poll[candidate]+' (need '+(votesRequired - poll[candidate])+' more)');
        }
      }
      var votes = 0;
    }
  };
}
