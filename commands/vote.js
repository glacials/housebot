var votesRequired = 8;
var strobeCount = 8;
var numFlips = 0;

var polls = {
  lights: {
    on:  0,
    off: 0,
    strobe: 0
  }
};

var triggers = {
  lights: {
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
  }
};

module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'vote',
    valid: (argv.length === 1 && argv[0] === 'vote') ||
           (argv.length === 2 && argv[0] === 'vote' && argv[1] in polls) ||
           (argv.length === 3 && argv[0] === 'vote' && argv[1] in polls && argv[2] in polls[argv[1]]) ||
           (argv.length === 1 && argv[0] in polls) ||
           (argv.length === 2 && argv[0] in polls && argv[1] in polls[argv[0]]),
    run: function() {
      if (!options.devices[3]) {
        options.bot.say(options.channel, "I'm not hooked up to any lights right now!");
        return;
      }
      if (argv[0] !== 'vote') {
        argv.unshift('vote');
      }
      if (argv.length === 1) {
        options.bot.say(options.channel, 'open polls → '+Object.keys(polls).join(' '));
      } else if (argv.length === 2) {
        response = 'candidates for '+argv[1]+' → ';
        Object.keys(polls[argv[1]]).forEach(function(candidate, numVotes, options) {
          response += candidate+' ';
        });
        options.bot.say(options.channel, response);
      } else if (argv.length === 3) {
        polls[argv[1]][argv[2]]++;
        if (polls[argv[1]][argv[2]] >= votesRequired) {
          triggers[argv[1]][argv[2]](options.bot, options.channel, options.devices);
          Object.keys(polls[argv[1]]).forEach(function(candidate, numVotes, options) {
            polls[argv[1]][candidate] = 0;
          });
        } else {
          options.bot.say(options.channel, argv[1]+' '+argv[2]+' → now '+polls[argv[1]][argv[2]]+' (need '+(votesRequired - polls[argv[1]][argv[2]])+' more)');
        }
      }
      var votes = 0;
    }
  };
};
