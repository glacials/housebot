module.exports = function() {
  return {
    // What's the path to the connected Z-Wave hub?
    //   This will typically be a device path in the form of /dev/SOMETHING
    //   On OS X with an Aeon Z-Stick 2 using [silabs drivers][1], this is '/dev/cu.SLAB_USBtoUART'.
    //   (Please fill in more examples here if you have them.)
    //   [1]: http://www.silabs.com/products/mcu/pages/usbtouartbridgevcpdrivers.aspx
    zwaveHubPath: '/dev/cu.SLAB_USBtoUART',

    // What IRC server should I connect to?
    //   For Twitch, this should be 'irc.twitch.tv'.
    server: 'irc.twitch.tv',

    // What username should I use for IRC?
    //   For Twitch, you will need to own this account so you can produce an OAuth token (see below).
    username: 'housebot',

    // What password should I log into the server with?
    //   If you don't need one, this should be an empty string.
    //   For Twitch, this should be the above account's OAuth token. Get this from http://www.twitchapps.com/tmi/.
    password: '',

    // What channels should I monitor?
    //   Make sure to put commas after each one (except the last). Include the hash ('#').
    channels: [
      '#channel-name-here',
      '#another-channel-name-here',
      '#you-get-the-picture'
    ],

    // Who owns the devices being controlled?
    //   This person gets exclusive access to the `force` command.
    owner: 'your-username-here',

    // How many seconds should I wait between sending messages?
    //   The sweet spot depends on the server, but for Twitch this should be nonzero to avoid getting dropped messages.
    spamDelay: 2,

    // Should I tell node-irc to display errors and debug messages?
    //   Turning this on can be helpful if you're not able to connect to IRC and you don't know why.
    debug: false
  };
};
