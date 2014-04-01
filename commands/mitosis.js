var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);

module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: /^(mitosis|fork|split)$/.test(argv.join(' ')),
    run: function() {
      channels = db.get('channels') || [];
      if (options.user.name === options.bot.name) {
        options.bot.say(options.channel, 'Copy myself into my own channel? I refuse! Who am I -- Mr. Meeseeks?');
      } else if (channels.indexOf('#'+options.user.name) !== -1) {
        options.bot.say(options.channel, options.user.name+'\'s channel is already covered by one of my copies!');
      } else {
        options.bot.join('#'+options.user.name, function() {
          db.set('channels', channels.concat('#'+options.user.name));
          options.bot.say(options.channel, 'Copied myself into '+options.user.name+'\'s channel.');
        });
      }
    }
  };
};
