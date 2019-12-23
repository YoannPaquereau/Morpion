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
      drawGame();
    }
}

    function drawGame() {
        var x = 25;
        var y = 25;
        for  (var i = 0; i < 2; i++) {
            myGameArea.context.beginPath();
            myGameArea.context.moveTo(25,45);
            myGameArea.context.lineTo(180,45);
            myGameArea.context.stroke();
        }
        
    }