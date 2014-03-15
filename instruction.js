module.exports = function(message) {
  return {
    command: message.substring(1, message.length).split(' ')[0].toLowerCase(),
    argv: message.substring(1, message.length).split(' '),
    args: {
      length: message.split(' ').length - 1,
      first:  message.split(' ').length >= 2 ? message.substring(1, message.length).split(' ')[1].toLowerCase() : null,
      second: message.split(' ').length >= 3 ? message.substring(1, message.length).split(' ')[2].toLowerCase() : null,
      third:  message.split(' ').length >= 4 ? message.substring(1, message.length).split(' ')[3].toLowerCase() : null
    }
  };
}
