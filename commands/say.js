module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: /^say (.+) (.+)$/.test(argv.join(' ')),
    run: function() {
      if (options.user.is_owner) {
        options.bot.say('#'+argv[1], argv.slice(2).join(' '));
      }
    }
  };
};
