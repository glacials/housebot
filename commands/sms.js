module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'sms',
    valid: argv[0] === 'sms' && argv.length === 1,
    run: function() {
      options.bot.say(options.channel, 'http://bombch.us/Ut');
    }
  };
};
