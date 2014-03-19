*Note: Housebot is currently set up very messily and functions very specifically to my network of devices, as I just
kind of threw him together. Now that he works, my first priority is to fix this. Until I do, he'll take some coercing
before he cooperates with any other network.*

# housebot

Housebot is an IRC bot that controls Z-Wave devices, like outlets or lights, with a voting system. For now he only
controls binary switch devices, not multi-level devices like faders. To use his home automation abilities you will need
a Z-Wave hub-like device hooked up to whatever machine you run him on. I use the Aeon Z-Stick Series 2.

Housebot uses [node-openzwave][1] and [Node.js][2]. He is licensed under the [MIT license][3], aka the "do whatever you
want with me" license. <3

## Chat usage

Housebot commands all start with a bang (`!`). They are:

 * `!housebot`: Say a helpful message about other commands. This command changes to reflect Housebot's username.
 * `!vote`: See a list of open polls.
 * `!vote <poll>`: See a list of candidates for `<poll>`.
 * `!vote <poll> <candidate>`: Vote for `<candidate>` in `<poll>`. Housebot will confirm the vote with a response.

## Running locally

### Dependencies

You will need Node.js. Your package manager probably has it listed under `node` or `nodejs`. Then in this directory,

    npm install

should take care of the rest.

## First-time run

    cp config{.default,}.js
    $EDITOR config.js  # Fill out this file
    node housebot.js

Currently you may have to do some manual work configuring this to work with your Z-Wave network -- I'm still improving
on generalizing this part so that this isn't necessary.

[1]: https://github.com/jperkin/node-openzwave
[2]: http://nodejs.org/
[3]: http://opensource.org/licenses/MIT
