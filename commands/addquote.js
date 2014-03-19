var fs = require('fs');

module.exports = function(args, bot, channel, nicks, devices) {
  return {
    command: 'addquote',
    valid: args[0] === 'addquote' && args.length >= 1,
    run: function(bot, channel) {
      var command = args.shift();
      var quote   = args.join(' ');
      fs.appendFile('submitted-quotes.txt', quote+'\n', function(err) {
        console.log(err);
      });
      bot.say(channel, 'Your quote has been added for review!');
    }
  };
}
