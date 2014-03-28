module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: argv[0] === 'say'
    run: function() {
      if (options.user.is_owner) {
        options.bot.say(options.channel, argv.slice(1).join(' '));
      }
    }
  };
};
