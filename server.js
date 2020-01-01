var fs = require('fs');

const express = require('express');
const app = new express();
var server = require('http').createServer(app);

app.use(express.static(__dirname + '/static'));
app.get('/', function(request, response){
    response.sendFile(__dirname + '/static/index.html');
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

var rooms = 0;

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.on('createGame', function(data) {
        socket.join('room-' + ++rooms);
        socket.emit('newGame', "room-" + rooms);
    });

    socket.on('joinGame', function(data) {
        var room = io.nsps['/'].adapter.rooms(data.room);
        if (room && room.length == 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', {});
        }
        else {
            socket.emit('err', {message: 'Partie pleine ou indisponible'});
        }
        socket.emit('newGame', 'room-' + data);
    });
});

server.listen(8080);