var display = {

  canvas: null,
  context: null,
  cameraX: 0,
  tileSheet: null,
  coinSprite: null,
  exitSprite: null,

  init: function() {
    display.canvas = document.querySelector('canvas');

    display.canvas.width = 640;
    display.canvas.height = 480;

    display.context = display.canvas.getContext('2d');

    display.spriteSheet = new Image();
    display.spriteSheet.src = 'blob_orange_spritesheet_32x32.png';

    display.tileSheet = new Image();
    display.tileSheet.src = 'tileset_32x32.png';

    display.coinSprite = new Image();
    display.coinSprite.src = 'coin_32x32.png';

    display.exitSprite = new Image();
    display.exitSprite.src = 'exit_32x32.png';
  },

  draw: function(game) {
    var context = display.context;
    var tileSize = game.tileSize;
    var player = game.player;
    var mapWidth = game.tileMap[0].length * tileSize;

    display.cameraX = Math.max(0, Math.min(player.x - display.canvas.width / 2 + player.width / 2,  
      mapWidth - display.canvas.width
    ));

    context.clearRect(0, 0, display.canvas.width, display.canvas.height);

    // Mapa

    for (var row = 0; row < game.tileMap.length; row++) {
        for (var col = 0; col < game.tileMap[row].length; col++) {
                     
            var tile = game.tileMap[row][col];        
            var x = col * tileSize - display.cameraX;        
            var y = row * tileSize;

            if (tile === '1') {
                  
              if (display.tileSheet && display.tileSheet.complete && display.tileSheet.naturalWidth > 0) {
         
                // Coordenadas de la textura dentro del PNG, posición y tamaño
                context.drawImage(display.tileSheet, 0, 0, 32, 32, x, y, tileSize, tileSize);

    
              } else {
        
                // Textura provisional
                context.fillStyle = '#558b2f';
                context.fillRect(x, y, tileSize, tileSize);
    
              }

            }

            // Objeto coleccionable (C).
            if (tile === 'C') {
                  
              if (display.coinSprite && display.coinSprite.complete && display.coinSprite.naturalWidth > 0) {
        
                context.drawImage(display.coinSprite, x, y, tileSize, tileSize);
    
              }
              context.save();

            }

            if (game.tileMap[row][col] === 'E') {
                  
              if (display.exitSprite && display.exitSprite.complete && display.exitSprite.naturalWidth > 0) {
        
                context.drawImage(display.exitSprite, x, y, tileSize, tileSize);
    
              } else {
        
                // Dibujo provisional
        
                context.fillStyle = '#ffca28';
                context.fillRect(x + 4, y + 4, tileSize - 8, tileSize - 4);
    
              }

            }

            // Nivel
            if (!game.completed && !game.gameOver) {

              context.save();
    
              context.fillStyle = '#ffffff';
              context.font = 'bold 18px Arial';
              context.textAlign = 'left';
              context.shadowColor = '#000000';
              context.shadowBlur = 3;

    
              // Nombre del nivel.
              context.fillText(game.levels[game.currentLevel].name, 12, 24);

              // Monedas.
              context.textAlign = 'right';

              context.fillText('Monedas: ' + game.itemsCollected + ' / ' + game.totalItems,
                display.canvas.width - 12, 24
              );

              context.save();

              context.fillStyle = game.shieldActive ? '#29b6f6' : '#bdbdbd';
              context.font = 'bold 18px Arial';
              context.textAlign = 'left';
              context.shadowColor = '#000000';
              context.shadowBlur = 3;

              context.fillText(game.shieldActive ? 'Escudo: ACTIVO' : 'Escudo: NO DISPONIBLE', 
                12, 72
              );
              
              context.restore();

              // Vidas.
              context.textAlign = 'left';

              context.fillText('Vidas: ' + game.lives, 12, 48);
              context.restore();

            }

            context.save();

            // Pantalla de derrota
            if (game.gameOver) {

              context.fillStyle = 'rgba(0, 0, 0, 0.78)';

              context.fillRect(0, 0, display.canvas.width, display.canvas.height);

              context.fillStyle = '#ffffff';  
              context.textAlign = 'center';
              context.font = 'bold 38px Arial';

              context.fillText('¡Juego terminado!', display.canvas.width / 2, 220);

              context.font = '20px Arial';

              context.fillText('Te has quedado sin vidas', display.canvas.width / 2, 260);

            }

            // Mensaje de finalización
            if (game.completed) {
                
              context.fillStyle = 'rgba(0, 0, 0, 0.7)';                    
              context.fillRect(0, 0, display.canvas.width, display.canvas.height);
                 
              context.fillStyle = 'white';                    
              context.font = 'bold 32px Arial';                    
              context.textAlign = 'center';
                   
              context.fillText('¡Juego completado!', display.canvas.width / 2, display.canvas.height / 2);

            }
        }
    }

    // Escudo
    if (game.shield && !game.shield.collected) {
          
      var shield = game.shield;
      var shieldX = shield.x - display.cameraX;
        
      context.save();
      
      // Círculo azul.    
      context.fillStyle = '#29b6f6';      
      context.beginPath();       
      context.arc(shieldX + shield.width / 2, shield.y + shield.height / 2, shield.width / 2, 0, Math.PI * 2);    
      context.fill();
         
      // Borde del escudo.        
      context.strokeStyle = '#e1f5fe';        
      context.lineWidth = 3;  
      context.stroke();
    
      // Letra S.        
      context.fillStyle = '#ffffff';     
      context.font = 'bold 16px Arial';      
      context.textAlign = 'center';      
      context.textBaseline = 'middle';       
      context.fillText('S', shieldX + shield.width / 2, shield.y + shield.height / 2);
       
      context.restore();
       
    }

    // Enemigos
    for (var i = 0; i < game.enemies.length; i++) {

      var enemy = game.enemies[i];
      var enemyX = enemy.x - display.cameraX;

      context.save();

      // Cuerpo del enemigo.
      context.fillStyle = '#c62828'; 
      context.beginPath();

      context.arc(enemyX + enemy.width / 2, enemy.y + enemy.height / 2 + 2,
        enemy.width / 2, Math.PI, 0
      );

      context.lineTo(enemyX + enemy.width, enemy.y + enemy.height);

      context.lineTo(enemyX, enemy.y + enemy.height);

      context.closePath();
      context.fill();

      // Ojos blancos.
      context.fillStyle = '#ffffff';
      context.beginPath();

      context.arc(enemyX + 9, enemy.y + 11, 4, 0, Math.PI * 2);
      context.arc(enemyX + 19, enemy.y + 11, 4, 0, Math.PI * 2);

      context.fill();

      // Pupilas.
      context.fillStyle = '#212121';
      context.beginPath();

      context.arc(enemyX + 10, enemy.y + 12, 2, 0, Math.PI * 2);
      context.arc(enemyX + 18, enemy.y + 12, 2, 0, Math.PI * 2);

      context.fill();

      context.restore();

    }

    var player = game.player;
    var playerScreenX = player.x - display.cameraX;

    var frameWidth = 32;
    var frameHeight = 32;

    // Coordenadas dentro del sprite sheet
    var sourceX = player.frame * frameWidth;
    var sourceY = player.animationRow * frameHeight;
    var showPlayer = game.invulnerabilityTimer === 0 ||
                 Math.floor(game.invulnerabilityTimer / 6) % 2 === 0;

    if (
      display.spriteSheet &&
      display.spriteSheet.complete &&
      display.spriteSheet.naturalWidth > 0
    ) {

      context.save();

      // Voltear el personaje si mira hacia la izquierda
      if (player.facing === -1) {

        context.translate(playerScreenX + player.width, player.y);

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
          playerScreenX, player.y,
          player.width, player.height
        );
      }

      context.restore();

    } else if (showPlayer) {

      // Personaje provisional mientras carga la imagen
      context.fillStyle = '#ff9800';

      context.beginPath();

      context.arc(playerScreenX + player.width / 2, player.y + player.height / 2,
        player.width / 2 - 2, 0, Math.PI * 2
      );

      context.fill();
    }

    // Escudo activo
    if (game.shieldActive) {
    
      context.save();

      context.strokeStyle = '#29b6f6';
      context.lineWidth = 4;
      context.globalAlpha = 0.8;
    
      context.beginPath();
      context.arc(playerScreenX + player.width / 2, player.y + player.height / 2, player.width / 2 + 5, 0, Math.PI * 2);
      context.stroke();
    
      context.restore();

    }
  }
};