var db = require('json-storage').JsonStorage.create(new (require('node-localstorage').LocalStorage)('./db'), false);
var cli = require('readline').createInterface({ input: process.stdin, output: process.stdout });
var config = require('./config.js')();
var zwave = new (require('openzwave'))(config.zwave_hub);

var scan_time = 30;

zwave.on('driver ready',  function(homeid) { console.log('Waiting '+scan_time+' seconds for devices to register.'); });

var devices = {};

var name_of = function(command) {
  if (command ===  32) return 'meter';
  if (command ===  37) return 'binary switch';
  if (command ===  38) return 'multilevel switch';
  if (command === 134) return 'version';
  return "unknown value ("+command+")";
};

var Device = function(options) {
  options = options || {};
  this.id           = options.id;
  this.ready        = options.ready;
  this.name         = options.name;
  this.manufact     = options.manufacturer;
  this.manufact_id  = options.manufacturerid;
  this.product      = options.product;
  this.product_id   = options.productid;
  this.product_type = options.producttype;
  this.type         = options.type;
  this.is_switch    = false;
  this.turn_on = function() { zwave.switchOn(this.id); };
  this.turn_off = function() { zwave.switchOff(this.id); };
  this.save = function() {
    zwave.setName(this.id, this.name);
    zwave.setLocation(this.id, this.loc);
  };
  this.print = function() {
    console.log('id: '+this.id);
    console.log('Ready: '+this.ready);
    console.log('Name: '+this.name);
    console.log('Location: '+this.loc);
    console.log('Manufacturer: '+this.manufact+' ('+this.manufact_id+')');
    console.log('Product: '+this.product+' ('+this.product_id+', '+this.product_type+')');
    console.log('Type: '+this.type);
    this.is_switch && console.log('Switch?: '+this.is_switch);
    this.on        && console.log('On?: '+this.on);
    this.version   && console.log('Version: '+this.version);
  };
};

zwave.on('node added', function(id) {
  devices[id] = new Device({
    id:    id,
    ready: false
  });
});

zwave.on('node ready', function(id, info) {
  console.log('node ready');
  devices[id].name         = info.name;
  devices[id].loc          = info.loc;
  devices[id].manufact     = info.manufacturer;
  devices[id].manufact_id  = info.manufacturerid;
  devices[id].product      = info.product;
  devices[id].product_id   = info.productid;
  devices[id].product_type = info.producttype;
  devices[id].type         = info.type;
  devices[id].ready        = true;
});

zwave.on('value added', function(device_id, command_class, value) {
  if (name_of(command_class) === 'binary switch') {
    devices[device_id].on = value.value;
    devices[device_id].is_switch = true;
  } else if (name_of(command_class) === 'multilevel switch') {
    devices[device_id].level = value.value;
  } else if (name_of(command_class) === 'version') {
    devices[device_id].version = value.value;
  }
});

zwave.connect();

setTimeout(function() {
  if ((db.get('devices') || {}) === devices) {
    console.log('No network change since last check. You\'re good to go!');
  } else {
    Object.keys(devices).forEach(function(id) {
      devices[id].print();
    });
  }
}, scan_time * 1000);
