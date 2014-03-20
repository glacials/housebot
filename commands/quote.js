var fs = require('fs');
fs.exists('quotes.txt', function (exists) {
  if (!exists) {
    fs.writeFile('quotes.txt', 'No quotes yet!\n');
  }
});
fs.exists('submitted-quotes.txt', function (exists) {
  if (!exists) {
    fs.writeFile('submitted-quotes.txt', '');
  }
});

module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'quote',
    valid: argv[0] === 'quote' && argv.length === 1,
    run: function() {
      var command = argv.shift();
      var quote   = argv.join(' ');
      quotes = fs.readFileSync('quotes.txt').toString().split('\n');
      quotes.pop(); // Get that last newline out of there
      options.bot.say(options.channel, quotes[Math.floor(Math.random() * quotes.length)]);
    }
  };
}
