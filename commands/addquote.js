var fs = require('fs');

module.exports = function(argv, options) {
  return {
    command: 'addquote',
    valid: argv[0] === 'addquote' && argv.length >= 1,
    run: function() {
      var quote = argv.slice(1).join(' ');
      fs.appendFile('submitted-quotes.txt', quote+'\n', function(error) {
        if (error) throw error;
        options.bot.say(options.channel, 'Your quote has been added for review!');
      });
    }
  };
}
