var fs = require('fs');

module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: new RegExp('/^help|commands|'+options.bot.name+'$/').test(argv.join(' ')),
    run: function() {
      var commands = [];
      fs.readdir('./commands', function(err, files) {
        files.forEach(function(filename) {
          if (filename[0] !== '.' && filename.split('.').pop() === 'js') {
            commands += push('!'+filename.slice(0, -3));
          }
        });
      });
      options.bot.say(options.channel, 'Commands: '+commands.join(', '));
    }
  };
};
