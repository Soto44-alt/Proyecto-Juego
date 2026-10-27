var display = {

  canvas: null,
  context: null,

  init: function() {
    display.canvas = document.querySelector('canvas');

    display.canvas.width = 640;
    display.canvas.height = 480;

    display.context = display.canvas.getContext('2d');
  },

  draw: function(game) {
    var context = display.context;
    var tileSize = game.tileSize;

    context.clearRect(0, 0, display.canvas.width, display.canvas.height);

    // Mapa

    for (var row = 0; row < game.tileMap.length; row++) {
        for (var col = 0; col < game.tileMap[row].length; col++) {
            
            if (game.tileMap[row][col] === '1') {
                context.fillStyle = '#558b2f';
                
                context.fillRect(
                    col * tileSize,
                    row * tileSize,
                    tileSize,
                    tileSize
                );
                
                context.strokeStyle = '#33691e';
                
                context.strokeRect(
                    col * tileSize,
                    row * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }


    context.fillStyle = 'red';
    context.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
  }
};