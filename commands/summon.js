module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: argv[0] === 'summon' && argv.length === 1,
    run: function() {
      if (options.user.is_owner) {
        options.bot.say(options.channel, 'You called, master?');
      }
    }
  };
};
