# housebot
Housebot is a Twitch chat bot that lets your viewers control your Phillips Hue lights by voting in chat. It also has a
couple of other bot basics.

## Chat usage
Housebot chat commands all start with a bang (`!`). They are:

* `!housebot`: Show commands.
* `!lights on|off|flicker`: Vote for lights to turn on or off (by default 10 unique votes are required).
* `!quote`: Display a random quote.
* `!addquote <quote>`: Add a quote to be reviewed.
* `!todo <item>`: Add an item to the todo list.
* `!todo`: Display the todo list.
* `!mitosis`: Make Housebot join your channel.
* `!seppuku`: Make Housebot leave your channel.

Quotes added using `!addquote` need to be reviewed by the channel owner before they can be seen with `!quote`. To
review quotes, channel owners have the following three extra commands:

* `!review`: Show the oldest quote in the submission queue.
* `!approve`: Move the oldest quote in the submission queue to the quotes list.
* `!reject`: Destroy the oldest quote in the submission queue.

### Lights
At the moment lighting support is rudimentary -- Housebot will scrape all lights from your bridge and chat commands will
affect them all simultaneously. In the future, I think support for specifying Rooms and even Routines would be cool to
add.

I hope this goes without saying, but please do not leave Housebot running when you don't want people on the internet
controlling your lights.

## Local devleopment
For Housebot's lighting commands to work, you'll need to run it locally. If you only care about the bot basics and not
the lighting, you can !mitosis Housebot from an existing chat room.

The oddness of this command existing alongside the above recommendation to shut him down when not in use is because
there's still plenty of work to do on Housebot, and ultimately I'd like to not require that people run him locally to
get his full featureset safely.

### Prerequisites
* Node.js (`brew install node`)
* CoffeeScript (`npm install -g coffee-script`)

### Running
    npm install
    coffee housebot.coffee

A first-time run will interactively walk you through setting up a Twitch account for the bot to use and a Hue bridge to
connect to for lighting control. You will need physical access to your Hue bridge so that you can press the big button
on it.

For lighting commands in chat to work, open `housebot.coffee` and change the guard around line 29 to check for your
channel, not mine. The intention of this guard is to prevent people from !mitosising Housebot into their own channel,
then voting in a chat room invisible to you where you can't ban them from talking. This is a temporary band-aid.
