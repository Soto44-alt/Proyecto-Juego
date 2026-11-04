var game = {

    gravity: 0.5,

    tileSize: 32,
        
    tileMap: [
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000001110000000",
        "00000000111000000000",
        "00000000000000011100",
        "00000111000000000000",
        "00000000000011100000",
        "00000000000000000000",
        "11111111111111111111"
    ],
    
    player: {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        speed: 5,
        velocityX: 0,
        velocityY: 0,
        jumpStrength: -10,
        grounded: false
    },
    
    init: function() {
        game.player.x = display.canvas.width / 2;
        game.player.y = display.canvas.height - game.player.height;
    },

    resolveCollisions: function(axis) {
        
        var player = game.player;
        var tileSize = game.tileSize;

        // Coordenadas de los bloques que ocupa el jugador
        var left = Math.floor(player.x / tileSize);
        var right = Math.floor((player.x + player.width - 0.001) / tileSize);

        var top = Math.floor(player.y / tileSize);
        var bottom = Math.floor((player.y + player.height - 0.001) / tileSize);
        
        // Recorrer los bloques cercanos al jugador

        for (var row = top; row <= bottom; row++) {

            for (var col = left; col <= right; col++) {

                // Comprobar que el bloque existe y es sólido

                if (
                    game.tileMap[row] &&
                    game.tileMap[row][col] === '1'
                ) {

                    // Colisión horizontal
                    if (axis === 'x') {

                        if (player.velocityX > 0) {

                            // Colisión por la derecha
                            player.x = col * tileSize - player.width;

                        } else if (player.velocityX < 0) {

                            // Colisión por la izquierda
                            player.x = (col + 1) * tileSize;

                        }

                        player.velocityX = 0;
                    }
                    
                    // Colisión vertical
                    if (axis === 'y') {

                        if (player.velocityY > 0) {

                            // El jugador aterriza sobre el bloque
                            player.y = row * tileSize - player.height;

                            player.grounded = true;

                        } else if (player.velocityY < 0) {

                            // El jugador golpea el bloque desde abajo
                            player.y = (row + 1) * tileSize;

                        }

                        player.velocityY = 0;
                    }
                }
            }
        }
    },
    
    update: function() {
        var player = game.player;
        var canvas = display.canvas;

        // Movimiento horinzontal

        player.velocityX = 0;

        if (controller.keys['ArrowRight']) {
            player.velocityX = player.speed;
        }
        
        if (controller.keys['ArrowLeft']) {
            player.velocityX = -player.speed;
        }

        player.x += player.velocityX;
        game.resolveCollisions('x');

        if (player.x < 0) {
            player.x = 0;
        }
        
        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }

        // Salto
        
        if ((controller.keys['ArrowUp'] || controller.keys['Space']) && player.grounded) {
            player.velocityY = player.jumpStrength;
            player.grounded = false;
        }

        // Gravedad
        
        player.velocityY += game.gravity;
        player.y += player.velocityY;
        
        // Reiniciar el estado antes de comprobar el aterrizaje
        player.grounded = false;

        game.resolveCollisions('y');

        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }



    }
};