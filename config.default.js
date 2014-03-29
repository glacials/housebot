module.exports = function() {
  return {
    // What's the path to the connected Z-Wave hub?
    //   This will typically be a device path in the form of /dev/SOMETHING
    //   On OS X with an Aeon Z-Stick 2 using [silabs drivers][1], this is '/dev/cu.SLAB_USBtoUART'.
    //   (Please fill in more examples here if you have them.)
    //   [1]: http://www.silabs.com/products/mcu/pages/usbtouartbridgevcpdrivers.aspx
    zwave_hub: '/dev/cu.SLAB_USBtoUART',

    // What Twitch user am I signing in as?
    // You will need to own this account so you can produce an OAuth token (see below).
    username: 'housebot',

    // What is the above account's OAuth token?
    // Get this from http://www.twitchapps.com/tmi/.
    oauth: '',

    // How many seconds should I wait between sending messages?
    // To avoid getting messages dropped, this usually has to be nonzero.
    spamDelay: 2,

    // Should I tell node-irc to display errors and debug messages?
    // Turning this on can be helpful if I'm not showing up in chat and you don't know why.
    debug: false

    // What IRC server should I connect to?
    // You usually won't need to change this.
    server: 'irc.twitch.tv',
  };
};
