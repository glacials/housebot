*Note: Housebot is currently being rewritten in CoffeeScript. He should be fully functional, but he has no support for
controlling Z-Wave devices yet.*

# housebot

Housebot is a Twitch chat bot that controls Z-Wave devices, like outlets or lights, with a voting system. For now he
only controls binary switch devices, not multi-level devices like faders. To use his home automation abilities you will
need a Z-Wave hub-like device hooked up to whatever machine you run him on. I use the Aeon Z-Stick Series 2.

Housebot uses [Node.js][1] and [node-openzwave][2]. He is licensed under the [MIT license][3], aka the "do whatever you
want with me" license. <3

## Chat usage

Housebot commands all start with a bang (`!`). They are:

* `!housebot`: Show commands.
* `!quote`: Display a random quote.
* `!addquote <quote>`: Add a quote to be reviewed.
* `!todo`: Display a todo list.
* `!todo <item>`: Add an item to the todo list.
* `!mitosis`: Make Housebot join your channel.
* `!seppuku`: Make Housebot leave your channel.

## Running locally

### Dependencies

You will need Node.js. Your package manager probably has it listed under `node` or `nodejs`. Then in this directory,

    npm install

should take care of the rest.

[1]: http://nodejs.org/
[2]: https://github.com/jperkin/node-openzwave
[3]: http://opensource.org/licenses/MIT
