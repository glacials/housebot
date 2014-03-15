*Note: Housebot is currently set up very very messily and functions very very specifically to my network of devices, as
I just kind of threw him together. Now that he works, my first priority is to fix this. Until I do, he'll be difficult
to get to work with any other network.*

# housebot

Housebot is an IRC bot that controls Z-Wave devices with a voting system. For now he only controls binary switch
devices, not multi-level devices like sliders. To run him you will need a Z-Wave hub-like device hooked up to whatever
machine you run him on. I use the Aeon Z-Stick Series 2.

Housebot uses [node-openzwave][1] and Node.js.

## Chat usage

Housebot commands all start with a bang (`!`). They are:

 * `!housebot`: Say a helpful message about other commands. This command changes to reflect Housebot's username.
 * `!vote`: See a list of open polls.
 * `!vote <poll>`: See a list of candidates for `<poll>`.
 * `!vote <poll> <candidate>`: Vote for `<candidate>` in `<poll>`. Housebot will confirm the vote with a response.

## Running locally

### Dependencies

You should have Node.js installed. Then in this directory,

    npm install

should take care of the rest.

To run him with Twitch, you will need a file called `oauth` in this directory that contains your oauth token that you
login to Twitch chat via IRC with. You can get this from http://www.twitchapps.com/tmi. Also, you'll need to edit his
username near the top of `housebot.js` to use whatever Twitch account you're using.

## Running

After that, you should be able to

    node housebot.js

assuming your network is set up the exact same way that mine is (it isn't). (Again, my focus now is going to be on
generalization. Just open sourcing this now for posterity.)

[1]: https://github.com/jperkin/node-openzwave
