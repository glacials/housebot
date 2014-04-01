var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);

module.exports = function(argv, options) {
  return {
    valid: /^todo( .+)?$/.test(argv.join(' ')),
    run: function() {
      if (argv.length > 1) {
        var task = argv.slice(1).join(' ');
        db.set('todo-'+options.channel.slice(1), (db.get('todo-'+options.channel.slice(1)) || []).concat(task));
        options.bot.say(options.channel, 'Added todo item!');
      } else if (argv.length === 1) {
        var tasks = db.get('todo-'+options.channel.slice(1)) || [];
        if (tasks.length === 0) {
          options.bot.say(options.channel, 'Nothing to do!');
        } else if (tasks.length <= 8) {
          options.bot.say(options.channel, tasks.join(', '));
        } else {
          options.bot.say(options.channel, 'Too many tasks to list!');
        }
      }
    }
  };
};
