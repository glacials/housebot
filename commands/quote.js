var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);
module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: argv[0].match(/(approve|reject|review|add)?(quotes?)?/),
    run: function() {
      if (argv[0].match(/(approve|reject|review)(quotes?)?/) && (db.get('quotespending-'+options.channel) || []).length === 0) {
        options.bot.say(options.channel, 'No quotes to review :)');
        return;
      }
      if (argv[0] === 'quote') {
        quotes = db.get('quotes-'+options.channel) || ['No quotes yet!'];
        options.bot.say(options.channel, quotes[Math.floor(Math.random() * quotes.length)]);
      } else if (argv[0].match(/add/)) {
        db.set('quotespending-'+options.channel, (db.get('quotespending-'+options.channel) || []).concat(argv.slice(1).join(' ')));
        options.bot.say(options.channel, 'Your quote has been added for review!');
      } else if (argv[0].match(/review/) && options.user.is_owner) {
        next_quote = 
        options.bot.say(options.channel, '!approve or !reject: '+(db.get('quotespending-'+options.channel) || [])[0]);
      } else if (argv[0].match(/approve/) && options.user.is_owner) {
        quotes = db.get('quotespending-'+options.channel);
        db.set('quotes-'+options.channel, (db.get('quotes-'+options.channel) || []).concat(quotes.pop()));
        db.set('quotespending-'+options.channel, quotes);
        options.bot.say(options.channel, 'Quote approved!');
      } else if (argv[0].match(/reject/) && options.user.is_owner) {
        db.set('quotespending-'+options.channel, db.get('quotespending-'+options.channel).slice(1));
        options.bot.say(options.channel, 'Quote rejected!');
      }
    }
  };
};
