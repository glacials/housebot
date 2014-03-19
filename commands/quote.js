var fs = require('fs');

module.exports = function(args, bot, channel, nicks, devices) {
  return {
    command: 'quote',
    valid: args[0] === 'quote' && args.length === 1,
    run: function(bot, channel) {
      var command = args.shift();
      var quote   = args.join(' ');
      quotes = fs.readFileSync('quotes.txt').toString().split('\n');
      quotes.pop(); // Get that last newline out of there
      bot.say(channel, quotes[Math.floor(Math.random() * quotes.length)]);
    }
  };
}
