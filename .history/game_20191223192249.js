function startGame() {
    myGameArea.start();
  }
  
  var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = 500;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);

      this.checkbox = [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""]
      ];

      this.canvas.addEventListener('click',  function(event) {
          getTick(event);
      });

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
        
        var line = 0;
        var column = 0;

        console.log(y);

        if (y > 25 && y < 150+25) {
            line = 1;
        }
        
        else if (y > 150+25 && y < 150*2+25) {
            line = 2;
        }
        
        else if (y > 150*2+25 && y < myGameArea.canvas.height - 25) {
            line = 3; 
        }

        if (line != 0) {

        }
        console.log("line = " + line);
    }
