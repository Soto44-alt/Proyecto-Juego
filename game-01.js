var game = {

    gravity: 0.5,

    tileSize: 32,
        
    levels: [
        {
            name: "Nivel 1",
            map: [            
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
                "000000000000000000E0",            
                "11111111111111111111"
            ]
        },
        {
            name: "Nivel 2",
            map: [
                "00000000000000000000",
                "00000000000000000000",
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000001100000000",            
                "00000000000000000000",            
                "00000111000001110000",            
                "000000000000000000E0",            
                "11111111111111111111"
            ]
        }
    ],

    currentLevel: 0,
    completed: false,
    tileMap: [],

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

        // Variables de animación
        animationRow: 0,
        frame: 0,
        frameTimer: 0,
        frameDelay: 8,

        // Dirección: 1 derecha, -1 izquierda
        facing: 1
    },
    
    // Fotogramas por animación
    // 0 = Reposo
    // 1 = Correr
    // 2 = Salto
    // 3 = Caída
    animationFrames: [4, 6, 5, 5],
    
    init: function() {
        game.loadLevel(0);
    },

    loadLevel: function(levelIndex) {

        if (levelIndex >= game.levels.length) {
            game.completed = true;
            return;
        }

        game.currentLevel = levelIndex;

        // Copiar el mapa del nivel seleccionado
        game.tileMap = game.levels[levelIndex].map.slice();

        // Reiniciar la posición del jugador
        game.player.x = 32;
        game.player.y = 0;
    
        game.player.velocityX = 0;    
        game.player.velocityY = 0;
    
        game.player.grounded = false;
    
        // Reiniciar animación
        game.player.animationRow = 0;
        game.player.frame = 0;    
        game.player.frameTimer = 0;

        game.player.facing = 1;
    },


    advanceLevel: function() {

        game.loadLevel(game.currentLevel + 1);

    },

    checkLevelExit: function() {

        var player = game.player;
    
        // La salida está ubicada en la columna 18    
        var exitX = 18 * game.tileSize;
    
        if (        
            player.grounded &&        
            player.x + player.width > exitX
        ) {
            game.advanceLevel();
        }
    },

    
    // Tunneling
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

    // 1. Controlar las animaciones
    updateAnimation: function() {

        var player = game.player;
        var nextRow;

        // Seleccionar animación según el estado del jugador
        if (!player.grounded) {

            if (player.velocityY < 0) {
                nextRow = 2; // Salto
            } else {
                nextRow = 3; // Caída
            }

        } else if (player.velocityX !== 0) {

            nextRow = 1; // Correr

        } else {

            nextRow = 0; // Reposo
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

            player.frame = (player.frame + 1) % game.animationFrames[player.animationRow];
        }
    },
    
    update: function() {
        var player = game.player;
        var canvas = display.canvas;

        // No actualizar el juego si se completaron los niveles
        if (game.completed) {
            return;
        }

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

        // Comprobar si el jugador llegó a la salida
        game.checkLevelExit();

        // ACTUALIZAR ANIMACIÓN
        game.updateAnimation();

    }
};