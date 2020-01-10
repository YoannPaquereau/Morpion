var fs = require('fs');

const express = require('express');
const app = new express();
var server = require('http').createServer(app);
var roomdata = require('roomdata');

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
        roomdata.joinRoom(socket, 'room-' + ++rooms);
        roomdata.set(socket, 'players', {player1: data.player, player2: ""});
        socket.emit('newGame', { room:"room-" + rooms });
    });

    socket.on('joinGame', function(data) {
        var room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length == 1) {
            roomdata.joinRoom(socket, data.room);
            var gameBoard = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];
            roomdata.set(socket, "checkbox", gameBoard);
             roomdata.get(socket, 'players').player2 = data.player;
            io.in(data.room).emit('startGame', { room: data.room, turn:  Math.floor(Math.random() * (3 - 1) + 1) , players: roomdata.get(socket, "players")});
        }
        else {
            socket.emit('err', {message: 'Partie pleine ou indisponible'});
        }
    });

    socket.on('sendTick', function(data) {
        if (roomdata.get(socket, "checkbox")[data.line][data.column] == "") {
            roomdata.get(socket, "checkbox")[data.line][data.column] = data.player;

            io.in(data.room).emit('drawCase', { checkbox: roomdata.get(socket, "checkbox") });
            if (!endGame(data.player, roomdata.get(socket, "checkbox")))
                io.in(data.room).emit('changeTurn', { player: data.player });
            else
                io.in(data.room).emit('endgame', { player: data.player });
        }
    });
});

function endGame(playerCheck, checkbox) {
    var end = false;
    var count= 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (checkbox[i][j] == playerCheck) ++count;
        }
        if (count == 3) {
            end = true;
            i = 3;
        }
        else count = 0;
    }

    if (!end) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (checkbox[j][i] == playerCheck) ++count;
            }
            if (count == 3) {
                end = true;
                i = 3;
            }
            else count = 0;
        }

        if (!end) {
            if ((checkbox[0][0] == checkbox[1][1] == checkbox[2][2] == playerCheck) || (checkbox[0][2] == checkbox[1][1] == checkbox[2][0] == playerCheck)) {
                end = true;
            }
        }
    }

    return end;
}

server.listen(8080);