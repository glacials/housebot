var fs = require('fs');
var irc = require('irc');
var ozw = require('openzwave');

if (!fs.existsSync('config.js')) {
  console.log('You need to copy config.default.js -> config.js and fill it out!');
  process.exit();
}

var config = require('./config.js');
var command = require('./command.js');

var zwave = new ozw('/dev/cu.SLAB_USBtoUART');

var bot = new irc.Client(config.server, config.username, {
  userName: config.username,
  password: config.password,
  channels: config.channels,
  floodProtection: config.spamDelay !== 0,
  floodProtectionDelay: config.spamDelay,
  showErrors: config.debug,
  debug: config.debug
});

bot.addListener('join', function(channel, user) {
  if (user === config.username) {
    bot.say(channel, '/me has arrived!');
  }
});

bot.addListener('message#', function(user, channel, text, message) {
  text = text.trim();
  if (text[0] === '!') {
    text = text.slice(1);
    if (text.split(' ')[0] === '!lights') { // Allow `!lights` as an alias of `!vote lights`
      text = '!vote '+text.substring(1, text.length);
    }
    if (text.split(' ')[0] === config.username || text.split(' ')[0] === 'help' || text.split(' ')[0] === 'commands') {
      bot.say(channel, 'Commands: !vote, !quote, !addquote, !lights');
    } else {
      command(text.split(' ')).attempt({
        bot:     bot,
        channel: channel,
        devices: devices,
        user:    user,
        isOwner: user === config.owner
      });
    }
  }
});

var devices = [];
var Device = function() {
  return {
    turn: function(value) {
      if (value === 'on') {
        zwave.switchOn(device.id);
      } else if (value === 'off') {
        zwave.switchOff(device.id);
      }
    }
  };
};
devices.push(null);

var nameOf = function(command) {
  if (command ===  32) return "meter";
  if (command ===  37) return "binary switch";
  if (command ===  38) return "multilevel switch";
  if (command === 134) return "version";
  return "unknown setting ("+command+")";
};

zwave.on('connected',     function()       { process.stdout.write('Starting Z-Wave driver...'); });
zwave.on('driver ready',  function(homeid) { console.log('done.'); process.stdout.write('> '); });
zwave.on('driver failed', function()       { console.log('failed. Is the hub connected? (I\'ll continue to run in IRC-only mode.)'); process.stdout.write('> '); });

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
    console.log("Switch setting added!");
    console.log("  Device:  "+device.id);
    console.log("  Setting: "+device.setting.name+" (currently "+device.setting.value+")");
  } else if (setting.name === 'version') {
    device.version = setting;
  }
});

zwave.connect();

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
  command(text.trim().split(' ')).attempt({
    bot: {
      say: function(channel, text) { console.log(text); }
    },
    devices: devices,
    isOwner: true,
    verbose: true
  });
  process.stdout.write('> ');
});
