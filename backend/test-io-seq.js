var app = require('express')();
var server = require('http').createServer();
var io = require('socket.io')(server)

server.on('request', app)

app.get('/', function(req, res){

});

io.on('connection', function(socket){
  console.log('a user connected');
});

server.listen(3008, function(){
  console.log('listening on *:3000');
});
