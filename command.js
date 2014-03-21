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
    /* options can contain:
     *   devices (array): A list of devices the command may (or may not) need to control.
     *   isOwner (boolean): True if `user` owns the hardware in `devices`; false otherwise.
     *   user (string): The user from whom this command came.
     *   verbose (boolean): If true, complain if we can't process the command
     */
    attempt: function(options) {
      options = options || {};
      var success = false;
      commands.forEach(function(command) {
        if (command(argv).valid) {
          command(argv, options).run();
          success = true;
        }
      });
      if (!success && options.verbose) {
        options.bot.say(options.channel, "Unrecognized command.");
      }
    }
  };
};
