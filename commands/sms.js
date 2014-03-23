module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'sms',
    valid: argv[0] === 'sms' && argv.length === 1,
    run: function() {
      options.bot.say(options.channel, 'https://docs.google.com/spreadsheet/pub?key=0Akik9QOhyPLXdGdmMDdqcy1va3cwZFhYMm02dklqWFE&single=true&gid=8&output=html');
    }
  };
};
