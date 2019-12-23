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
        const rect =  myGameArea.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        var line;
        var column;

        console.log(y);
        switch(x) {
            case (y > 25 && y < 150+25):
                line = 1;
                break;
                
            case (y > 150+25 && y < 150*2+25):
                line = 2;
                break;
             
            case (y > 150*2+25 && y <myGameArea.canvas.height - 25):
                line = 3;
                break; 
             
            default:
                line = 0;
                break;
        }

        console.log("line = " + line);
    }

