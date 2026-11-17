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
                "00000000000C00000000",            
                "00000000000000000000",            
                "00000000000000000000",            
                "00000000001110000000",           
                "0000000011100000C000",           
                "00000000000000011100",            
                "00000111000000000000",           
                "00000000000011100000",            
                "0000C0000C00000000E0",            
                "11111111111111111111"
            ],
            enemies: [
                { x: 190, minX: 150, maxX: 300, speed: 1.5 },
                { x: 420, minX: 380, maxX: 530, speed: 1.8 }
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
                "00000000000C00000000",            
                "00000000000000000000",            
                "00000000000000C00000",            
                "000000C0001100000000",            
                "00000000000000000000",            
                "00000111000001110000",            
                "0000000000C0000000E0",            
                "11111111111111111111"
            ],
            enemies: [
                { x: 220, minX: 160, maxX: 330, speed: 1.8 }, 
                { x: 440, minX: 370, maxX: 540, speed: 2 }
            ]
        }
    ],

    currentLevel: 0,
    completed: false,
    gameOver: false,
    // Contador global de objetos recolectados en todos los niveles.
    itemsCollected: 0,
    totalItems: 8,

    // Sistema de vidas
    lives: 3,
    invulnerabilityTimer: 0,

    // Enemigos
    enemies: [],
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
        game.itemsCollected = 0;  
        game.lives = 3;   
        game.invulnerabilityTimer = 0;   
        game.completed = false;  
        game.gameOver = false;
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

        // Carga de enemigos
        game.enemies = game.levels[levelIndex].enemies.map(function(enemy) {
            return {
                x: enemy.x,
                y: 14 * game.tileSize - 28,            
                width: 28,           
                height: 28,            
                minX: enemy.minX,           
                maxX: enemy.maxX,            
                speed: enemy.speed,           
                direction: 1
            };
        });

        game.resetPlayerPosition();

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

    resetPlayerPosition: function() {
   
        game.player.x = 32;    
        game.player.y = 14 * game.tileSize - game.player.height;
  
        game.player.velocityX = 0;   
        game.player.velocityY = 0;
        game.player.grounded = false;
    
        game.player.animationRow = 0;  
        game.player.frame = 0;  
        game.player.frameTimer = 0; 
        game.player.facing = 1;

    },


    advanceLevel: function() {

        game.loadLevel(game.currentLevel + 1);

    },

    // Recolección de objetos
    checkItemCollection: function() {
    
        var player = game.player;
        var tileSize = game.tileSize;
        var left = Math.floor(player.x / tileSize);
        var right = Math.floor((player.x + player.width - 0.001) / tileSize);   
        var top = Math.floor(player.y / tileSize);    
        var bottom = Math.floor((player.y + player.height - 0.001) / tileSize);

        for (var row = top; row <= bottom; row++) {
        
            if (!game.tileMap[row]) continue;
        
            for (var col = left; col <= right; col++) {
            
                if (game.tileMap[row][col] === 'C') {

                    // Sustituir C por 0 evita recogerla dos veces.
                    game.tileMap[row] =
                    game.tileMap[row].substring(0, col) +
                    '0' +
                    game.tileMap[row].substring(col + 1);
                
                    game.itemsCollected++; 

                }
            }
        }
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

    // Mover enemigos
    updateEnemies: function() {

        for (var i = 0; i < game.enemies.length; i++) {

            var enemy = game.enemies[i];     
            enemy.x += enemy.speed * enemy.direction;
        
            if (enemy.x <= enemy.minX) {

                enemy.x = enemy.minX;
                enemy.direction = 1;

            } else if (enemy.x + enemy.width >= enemy.maxX) {

                enemy.x = enemy.maxX - enemy.width;
                enemy.direction = -1;
            }
        }
    },

    // Detectar enemigos con colisión
    checkEnemyCollisions: function() {

        if (game.invulnerabilityTimer > 0 || game.gameOver) return;

        var player = game.player;

        for (var i = 0; i < game.enemies.length; i++) {

            var enemy = game.enemies[i];
            var overlaps =
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y;

            if (overlaps) {
                game.takeDamage();
                return;
            }
        }
    },

    // Substracción de vidas
    takeDamage: function() {

        game.lives--;

        if (game.lives <= 0) {
            game.lives = 0;
            game.gameOver = true;
            return;
        }

        // Tiempo de invulnerabilidad.
        game.invulnerabilityTimer = 90;

        // Volver al punto inicial.
        game.resetPlayerPosition();

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

        // No actualizar el juego si se completaron los niveles
        if (game.completed || game.gameOver) {
            return;
        }

        if (game.invulnerabilityTimer > 0) {
            game.invulnerabilityTimer--;
        }

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
      
        game.updateEnemies();
        game.checkEnemyCollisions();

        if (game.gameOver) {
            return;
        }

        // Comprobar si el jugador llegó a la salida
        game.checkItemCollection();
        game.checkLevelExit();

        if (!game.completed) {
    
            game.updateAnimation();

        }

    }
};