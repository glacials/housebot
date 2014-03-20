var fs = require('fs');
var commands = [];
fs.readdirSync('./commands').forEach(function(file) {
  if (file[0] !== '.' && file.split('.').pop() === 'js') {
    commands.push(require('./commands/'+file));
  }
});

module.exports = function(argv) {
  return {
    argv: argv,
    /* options can currently only contain:
     *   verbose (boolean): If true, complain if we can't process the command
     */
    attempt: function(options) {
      options = options || {};
      if (!options.bot) {
        options.bot = { say: function(channel, text) { console.log(text); } };
      }
      var success = false;
      commands.forEach(function(command) {
        if (command(argv).valid) {
          command(argv, options).run();
          success = true;
        }
      });
      if (!success && options.verbose) {
        console.log("Unrecognized command.");
      }
    }
  };
}
