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
        grounded: false,

        // VARIABLES DE ANIMACIÓN
        animationRow: 0,
        frame: 0,
        frameTimer: 0,
        frameDelay: 8,

        // Dirección: 1 derecha, -1 izquierda
        facing: 1
    },
    
    // FOTOGRAMAS DE CADA ANIMACIÓN
    // 0 = Idle
    // 1 = Run
    // 2 = Jump
    // 3 = Fall
    animationFrames: [4, 6, 5, 5],
    
    init: function() {
        game.player.x = display.canvas.width / 2;
        game.player.y = display.canvas.height - game.player.height;
    },
    
    // MOVIMIENTO POR PEQUEÑOS PASOS PARA EVITAR TUNNELING
    moveWithCollisions: function(axis, distance) {
        
        var player = game.player;
        
        // Dividir el desplazamiento en pasos de máximo 8 píxeles
        
        var steps = Math.ceil(Math.abs(distance) / 8);
        
        if (steps === 0) return;
        
        var step = distance / steps;
        
        for (var i = 0; i < steps; i++) {
            // Mover horizontalmente
            if (axis === 'x') {
                player.x += step;
            }
            
            // Mover verticalmente
            if (axis === 'y') {
                player.y += step;
            }
            
            // Comprobar colisiones después de cada paso
            game.resolveCollisions(axis);
            
            // Si hubo colisión, detener el desplazamiento
            if (
                (axis === 'x' && player.velocityX === 0) ||
                (axis === 'y' && player.velocityY === 0)
            ) {
                break;
            }
        }
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

    // 1. CONTROLAR LAS ANIMACIONES
    updateAnimation: function() {

        var player = game.player;
        var nextRow;

        // Seleccionar animación según el estado del jugador
        if (!player.grounded) {

            if (player.velocityY < 0) {
                nextRow = 2; // JUMP
            } else {
                nextRow = 3; // FALL
            }

        } else if (player.velocityX !== 0) {

            nextRow = 1; // RUN

        } else {

            nextRow = 0; // IDLE
        }

        // Reiniciar fotogramas cuando cambia la animación
        if (nextRow !== player.animationRow) {

            player.animationRow = nextRow;
            player.frame = 0;
            player.frameTimer = 0;
        }

        // Controlar velocidad de reproducción
        player.frameTimer++;

        if (player.frameTimer >= player.frameDelay) {

            player.frameTimer = 0;

            player.frame =
                (player.frame + 1) %
                game.animationFrames[player.animationRow];
        }
    },
    
    update: function() {
        var player = game.player;
        var canvas = display.canvas;

        // Movimiento horinzontal

        player.velocityX = 0;

        if (controller.keys['ArrowRight']) {
            player.velocityX = player.speed;
            player.facing = 1;
        }
        
        if (controller.keys['ArrowLeft']) {
            player.velocityX = -player.speed;
            player.facing = -1;
        }

        game.moveWithCollisions('x', player.velocityX);

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
        
        // Reiniciar el estado antes de comprobar el aterrizaje
        player.grounded = false;

        game.moveWithCollisions('y', player.velocityY);

        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }

        // ACTUALIZAR ANIMACIÓN
        game.updateAnimation();

    }
};