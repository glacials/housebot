var fs = require('fs');
var commands = [];
fs.readdirSync('./commands').forEach(function(filename) {
  if (filename[0] !== '.' && filename.split('.').pop() === 'js') {
    commands.push('!'+filename.slice(0, -3));
  }
});

module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: (argv[0] === 'help' || argv[0] === 'commands') && argv.length === 1,
    run: function() {
      options.bot.say(options.channel, 'Commands: '+commands.join(', '));
    }
  };
};
