var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);

module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: /^(seppuku|suicide|selfdestruct|sd|shutdown|powerdown|poweroff|leave|depart|part|exit|quit)$/.test(argv.join(' ')),
    run: function() {
      channels = db.get('channels') || [];
      if (options.channel.slice(1) === options.bot.name) {
        options.bot.say(options.channel, 'If I leave my own channel I will die :( I won\'t do it!');
      } else if (options.user.is_owner) {
        options.bot.say(options.channel, '/me departs. :(');
        options.bot.part(options.channel);
        channels.splice(channels.indexOf(options.channel), 1);
        db.set('channels', channels);
      }
    }
  };
};
