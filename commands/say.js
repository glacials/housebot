module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: argv[0] === 'say' && argv.length > 2,
    run: function() {
      if (options.user.is_owner) {
        options.bot.say('#'+argv[1], argv.slice(2).join(' '));
      }
    }
  };
};
