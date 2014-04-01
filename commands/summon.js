module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: /^summon$/.test(argv.join(' ')),
    run: function() {
      if (options.user.is_owner) {
        options.bot.say(options.channel, 'You called, master?');
      }
    }
  };
};
