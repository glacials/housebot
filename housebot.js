var fs = require('fs');
var irc = require('irc');
var ozw = require('openzwave');
var instruction = require('./instruction.js');

// commands
var vote     = require('./commands/vote.js');
var quote    = require('./commands/quote.js');
var addquote = require('./commands/addquote.js');

var zwave = new ozw('/dev/cu.SLAB_USBtoUART');

var channelNicks = {
  test_deleted_user: []
}

var config = {
  channels: ['#test_deleted_user'],
  server: 'irc.twitch.tv',
  username: 'housebot',
  votes: new Array(),
  waitBetweenMessages: 2
};

var bot = new irc.Client(config.server, config.username, {
  userName: config.username,
  password: fs.readFileSync('oauth', { encoding: 'utf8' }),
  channels: config.channels,
  floodProtection: true,
  floodProtectionDelay: config.waitBetweenMessages
});

bot.addListener('join', function(channel, user) {
  if (user === config.username) {
    bot.say(channel, '/me has arrived!');
  }
});

bot.addListener('names', function(channel, names) {
  channelNicks[channel] = names;
});

bot.addListener('message#', function(user, channel, text, message) {
  text = text.trim();
  if (text[0] === '!') {
    if (text.split(' ')[0] === '!lights') { // Allow `!lights` as an alias of `!vote lights`
      text = '!vote '+text.substring(1, text.length);
    }
    instr = instruction(text);
    if (instr.command === config.username || instr.command === 'help' || instr.command === 'commands') {
      bot.say(channel, 'Commands: !vote, !quote, !addquote, !lights');
    } else if (vote(instr.argv).valid) {
      vote(instr.argv).run(bot, channel, channelNicks, devices);
    } else if (quote(instr.argv).valid) {
      quote(instr.argv).run(bot, channel);
    } else if (addquote(instr.argv).valid) {
      addquote(instr.argv).run(bot, channel);
    }
  }
});

var devices = [];
var Device = function() {
  return { turn: function(value) {
      if (value === 'on') {
        zwave.switchOn(device.id);
      } else if (value === 'off') {
        zwave.switchOff(device.id);
      }
    }
  }
}
devices.push(null);

var nameOf = function(command) {
  if (command ===  32) return "meter";
  if (command ===  37) return "binary switch";
  if (command ===  38) return "multilevel switch";
  if (command === 134) return "version";
  return "unknown setting ("+command+")";
};

zwave.on('connected',     function()       { process.stdout.write("Initializing driver..."); });
zwave.on('driver ready',  function(homeid) { console.log("done."); });
zwave.on('driver failed', function()       { console.log('failed. Is the receiver plugged in?'); /*process.exit(1);*/ });

zwave.on('node added',    function(id) {
  device = Device();
  device.id = id;
  devices.push(device);
});

zwave.on('node ready', function(id, info) {
  device = devices[id];
  device.name         = info.name;
  device.loc          = info.loc;
  device.manufacturer = info.manufacturer;
  device.product      = info.product;
  device.type         = info.type;
  device.ready        = true;
  console.log("Device found!");
  console.log("  Name:         "+(device.name || "not set"));
  console.log("  Location:     "+(device.loc || "not set"));
  console.log("  id:           "+device.id);
  console.log("  Manufacturer: "+device.manufacturer);
  console.log("  Product:      "+device.product);
  console.log("  Type:         "+device.type);
});

zwave.on('value added', function(deviceId, command, setting) {
  setting.name = nameOf(command);
  device = devices[deviceId];
  if (setting.name === 'binary switch') {
    device.setting = setting;
    console.log("Switch setting added!")
    console.log("  Device:  "+device.id);
    console.log("  Setting: "+device.setting.name+" (currently "+device.setting.value+")");
  } else if (setting.name === 'version') {
    device.version = setting;
  }
});

zwave.connect();
