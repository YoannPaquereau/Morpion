var socket = io.connect('http://localhost:8080');
var room;
var player;


document.getElementById("createSubmit").addEventListener("click", function(event){
    event.preventDefault();
    player = document.getElementById('playerName').value;
    socket.emit('createGame', {player: player});
  });

  document.getElementById("joinSubmit").addEventListener("click", function(event){
    event.preventDefault();
    player = document.getElementById('playerName').value;
    socket.emit('joinGame', { room: document.getElementById('room').value, player: player});
  });

  socket.on('newGame', function(data) {
      document.getElementById("formGame").remove();
  });

  socket.on('err', function(data) {
    document.getElementById('err').innerHTML = data.message;
  });

  function onClick(data) {
      console.log("Your turn");
        myGameArea.canvas.addEventListener('click',   
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
        
                if (column != -1) {
                    socket.emit('sendTick', {
                        room: room,
                        line: line,
                        column: column,
                        player: player
                    });
                    myGameArea.canvas.removeEventListener('click',  getTick);
                } 
            }
        );
    }

    socket.on('retry', function(data) {
        onClick();
    });

  socket.on('startGame', function(data) {
    room = data.room;
    startGame();
    if (player == data.turn) {
        onClick();
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
      this.checkbox = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ];
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);

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

    socket.on('drawCase', function (data) {
        myGameArea.checkbox = data.checkbox;
        console.log(data.player2);
        for (var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                if (myGameArea.checkbox[i][j] == player) {
                    var x = 40 + 150*j;
                    var y = 40 + 150*i;
        
                    myGameArea.context.beginPath();
                    myGameArea.context.moveTo(x, y);
                    myGameArea.context.lineTo(x + 120, y + 120);
                    myGameArea.context.stroke();
        
                    myGameArea.context.beginPath();
                    myGameArea.context.moveTo(x +120, y);
                    myGameArea.context.lineTo(x, y +120);
                    myGameArea.context.stroke();
                }
                else if(myGameArea.checkbox[i][j]  == data.player2) {
                    var x = 25 + 150*j + 75;
                    var y = 25 + 150*i + 75;
        
                    myGameArea.context.beginPath();
                    myGameArea.context.arc(x, y, 60, 0, 2*Math.PI,  false);
                    myGameArea.context.stroke();
                }
            }
        }
    });

    socket.on('changeTurn', function(data) {
        if (data.player != player) {
            onClick();
        }
    });

    socket.on('endgame', function(data) {
        console.log("Fin de la partie.");
        if (data.player == player)
            console.log("Vous avez gagné !");
        else
            console.log(data.player + " a gagné !");
    });
    
    socket.on('draw', function(data) {
        console.log("Match nul !");
    });
    

