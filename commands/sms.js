module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: /^sms$/.test(argv.join(' ')),
    run: function() {
      options.bot.say(options.channel, 'http://bombch.us/Ut');
    }
  };
};
