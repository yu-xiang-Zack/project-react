const socketIO = require('socket.io')

module.exports.restaurant = socketIO({
  path: '/restaurant'
})

module.exports.desk = socketIO({
  path: '/desk'
})
