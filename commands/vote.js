var votesRequired = 8;

var polls = {
  lights: {
    on:  0,
    off: 0
  }
}

var triggers = {
  lights: {
    on: function(bot, channel, devices) {
      // turn on
      bot.say(channel, 'Lights turning on!');
      devices[3].turn('on');
    },
    off: function(bot, channel, devices) {
      // turn off
      bot.say(channel, 'Lights turning off!');
      devices[3].turn('off');
    }
  }
}

module.exports = function(args, bot, channel, nicks, devices) {
  var command   = args[0];
  var pollName  = args[1];
  var poll      = polls[pollName];
  var candidate = args[2];
  if (args.length === 1 && command === 'vote') {
    bot.say(channel, 'open polls → '+Object.keys(polls).join(' '));
  } else if (args.length === 2 && poll) {
    response = 'candidates for '+instr.args.first+' → '
    Object.keys(poll).forEach(function(option, numVotes, options) {
      response += option+' ';
    });
    bot.say(channel, response);
  } else if (args.length === 3 && poll && candidate in poll) {
    poll[candidate]++;
    if (poll[candidate] >= votesRequired) {
      triggers[pollName][candidate](bot, channel, devices);
      Object.keys(poll).forEach(function(option, numVotes, options) {
        poll[option] = 0;
      });
    } else {
      bot.say(channel, pollName+' '+candidate+' → now '+poll[candidate]+' (need '+(votesRequired - poll[candidate])+' more)');
    }
  }
  var votes = 0;
  return {
    command: 'vote',
    valid: (args.length === 1) ||
           (args.length === 2 && poll in polls) ||
           (args.length === 3 && poll in polls && candidate in polls[poll])
  };
}