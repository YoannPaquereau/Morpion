var socket = io.connect('http://localhost:8080');
var room;
var player = "player";

document.getElementById("createSubmit").addEventListener("click", function(event){
    event.preventDefault();
    socket.emit('createGame', "");
  });

  document.getElementById("joinSubmit").addEventListener("click", function(event){
    event.preventDefault();
    socket.emit('joinGame', { room: document.getElementById('room').value });
    player += "2";
  });

  socket.on('newGame', function(data) {
      document.getElementById("formGame").remove();
      player += "1";
  });

  socket.on('err', function(data) {
    document.getElementById('err').innerHTML = data.message;
  });

  socket.on('startGame', function(data) {
    room = data.room;
    startGame();
    if (player == "player" + data.turn) {
        myGameArea.canvas.addEventListener('click',  function(event) {
            getTick(event);
        });
    }
  });

function startGame() {
    myGameArea.start();
  }
  
  var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = 500;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      this.player = "O";
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);

      this.checkbox = [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""]
      ];

      drawGame();
    }
}

    function drawGame() {
        var x = 25;
        var y = 25;

        for  (var i = 1; i <= 2; i++) {
            myGameArea.context.beginPath();
            myGameArea.context.moveTo(x, y+150*i);
            myGameArea.context.lineTo(myGameArea.canvas.width-25,  y+150*i);
            myGameArea.context.stroke();
        }

        for (var i = 1; i<=2; i++) {
            myGameArea.context.beginPath();
            myGameArea.context.moveTo(x + 150*i, y);
            myGameArea.context.lineTo(x + 150*i,  myGameArea.canvas.height - 25);
            myGameArea.context.stroke();
        }
    }

    function getTick(event) {
        var rect =  myGameArea.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        
        var line = -1;
        var column = -1;

        if (y > 25 && y < 150+25) line = 0;
        else if (y > 150+25 && y < 150*2+25) line = 1;
        else if (y > 150*2+25 && y < myGameArea.canvas.height - 25) line = 2; 

        if (line != -1) {
            if (x > 25 && x < 150+25) column = 0;
            else if (x > 150+25 && x < 150*2+25) column = 1;
            else if (x > 150*2+25 && x < myGameArea.canvas.width - 25) column = 2; 
        }

        if (myGameArea.checkbox[line][column] == "" && column != -1) {
            socket.emit('sendTick', { room: room, line: line, column: column, player: player });
        }        
    }

    socket.on('drawCase', function (data) {
        myGameArea.checkbox[data.line][data.column] = data.player;

        if (data.player == "player1") {
            var x = 25 + 150*data.column;
            var y = 25 + 150*data.line;

            myGameArea.context.beginPath();
            myGameArea.context.moveTo(x, y);
            myGameArea.context.lineTo(x + 150, y + 150);
            myGameArea.context.stroke();

            myGameArea.context.beginPath();
            myGameArea.context.moveTo(x +150, y);
            myGameArea.context.lineTo(x, y +150);
            myGameArea.context.stroke();
        }

        else if(data.player == "player2") {
            var x = 25 + 150*data.column + 75;
            var y = 25 + 150*data.line + 75;

            myGameArea.context.beginPath();
            myGameArea.context.arc(x, y, 60, 0, 2*Math.PI,  false);
            myGameArea.context.stroke();
        }
    });

