const app = require('./app')
const server = require('./http-server')
const io = require('./io-server')
const port = 800

server.on('request', app)

io.desk.attach(server)
io.restaurant.attach(server)

server.listen(port, () => {
  console.log('server listening on port', port)
})
