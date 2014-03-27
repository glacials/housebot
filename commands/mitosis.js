var ls = new (require('node-localstorage').LocalStorage)('./db');
var db = require('json-storage').JsonStorage.create(ls, 'housebot');

module.exports = function(argv, options) {
  options = options || {};
  return {
    command: 'mitosis',
    valid: argv[0] === 'mitosis' && argv.length === 1,
    run: function() {
      db.set('channels', (db.get('channels') || []).concat({
        name:            '#'+options.user,
        custom_commands: {},
        joined_at:       Date.now()
      }));
      options.bot.join('#'+options.user, function() {
        options.bot.say(options.channel, 'Splitting off into '+options.user+'.');
      });
    }
  };
};
