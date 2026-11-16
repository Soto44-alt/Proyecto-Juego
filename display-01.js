var display = {

  canvas: null,
  context: null,

  init: function() {
    display.canvas = document.querySelector('canvas');

    display.canvas.width = 640;
    display.canvas.height = 480;

    display.context = display.canvas.getContext('2d');

    display.spriteSheet = new Image();
    display.spriteSheet.src = 'blob_orange_spritesheet_32x32.png';
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

    var player = game.player;

    var frameWidth = 32;
    var frameHeight = 32;

    // Coordenadas dentro del sprite sheet
    var sourceX = player.frame * frameWidth;
    var sourceY = player.animationRow * frameHeight;

    if (
      display.spriteSheet &&
      display.spriteSheet.complete &&
      display.spriteSheet.naturalWidth > 0
    ) {
      context.save();

      // Voltear el personaje si mira hacia la izquierda
      if (player.facing === -1) {

        context.translate(
          player.x + player.width,
          player.y
        );

        context.scale(-1, 1);

        context.drawImage(
          display.spriteSheet,
          sourceX, sourceY,
          frameWidth, frameHeight,
          0, 0,
          player.width, player.height
        );

      } else {

        context.drawImage(
          display.spriteSheet,
          sourceX, sourceY,
          frameWidth, frameHeight,
          player.x, player.y,
          player.width, player.height
        );
      }

      context.restore();

    } else {

      // Personaje provisional mientras carga la imagen
      context.fillStyle = '#ff9800';

      context.beginPath();

      context.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        player.width / 2 - 2,
        0,
        Math.PI * 2
      );

      context.fill();
    }
  }
};