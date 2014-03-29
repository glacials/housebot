var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);
module.exports = function(argv, options) {
  options = options || {};
  return {
    valid: argv[0].match(/(approve(quote)?|reject(quote)?|review(quote)?|addquote|quote)/),
    run: function() {
      if (argv[0].match(/(approve|reject|review)(quotes?)?/) && (db.get('quotespending-'+options.channel.slice(1)) || []).length === 0) {
        options.bot.say(options.channel, 'No quotes to review :)');
        return;
      }
      if (argv[0].match(/quote/)) {
        quotes = db.get('quotes-'+options.channel.slice(1)) || ['No quotes yet!'];
        options.bot.say(options.channel, quotes[Math.floor(Math.random() * quotes.length)]);
      } else if (argv[0].match(/addquote/)) {
        db.set('quotespending-'+options.channel.slice(1), (db.get('quotespending-'+options.channel.slice(1)) || []).concat(argv.slice(1).join(' ')));
        options.bot.say(options.channel, 'Your quote has been added for review!');
      } else if (argv[0].match(/review(quote)?/) && options.user.is_owner) {
        next_quote = 
        options.bot.say(options.channel, '!approve or !reject: '+(db.get('quotespending-'+options.channel.slice(1)) || [])[0]);
      } else if (argv[0].match(/approve(quote)?/) && options.user.is_owner) {
        quotes = db.get('quotespending-'+options.channel.slice(1));
        db.set('quotes-'+options.channel.slice(1), (db.get('quotes-'+options.channel.slice(1)) || []).concat(quotes.pop()));
        db.set('quotespending-'+options.channel.slice(1), quotes);
        options.bot.say(options.channel, 'Quote approved!');
      } else if (argv[0].match(/reject(quote)?/) && options.user.is_owner) {
        db.set('quotespending-'+options.channel.slice(1), db.get('quotespending-'+options.channel.slice(1)).slice(1));
        options.bot.say(options.channel, 'Quote rejected!');
      }
    }
  };
};
