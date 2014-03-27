var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);

module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'mitosis',
    valid: argv[0] === 'mitosis' && argv.length === 1,
    run: function() {
      options.bot.join('#'+options.user, function() {
        db.set('channels', (db.get('channels') || []).concat('#'+options.user));
        options.bot.say(options.channel, 'Splitting off into '+options.user+'.');
      });
    }
  };
};
