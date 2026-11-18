// Función que construye mapas
function buildLevelMap(platforms, coins) {
    var rows = Array.from({ length: 15 }, function() {
        return Array(40).fill('0');
    });

    platforms.forEach(function(platform) {
        for (var col = platform[1]; col <= platform[2]; col++) {
            rows[platform[0]][col] = '1';
        }
    });

    coins.forEach(function(coin) {
        rows[coin[0]][coin[1]] = 'C';
    });

    rows[13][38] = 'E';
    rows[14].fill('1');
    return rows.map(function(row) { return row.join(''); });
}

var game = {

    gravity: 0.5,
    tileSize: 32,
        
    levels: [
        {
            name: "Nivel 1 - Pradera",
            textureRow: 0,
            textureStart: 0,
            textureCount: 8,
            backgroundColor: '#81d4fa',
            map: [            
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "00000000000000000000000000000CC000000000",
                "0000000000000000000000000000000000000000",
                "0001111000000000111100000001111100111100",
                "00000000000C000000000C000000000000000000",
                "0000000000111100000011110000000011110000",
                "0000000C000000000C0000000000000000000000",
                "0000011111000001111100000011111000000000",
                "00C00000000000000000000000000000000000E0",
                "1111111111111111111111111111111111111111"
            ],

            enemies: [
                { x: 190, y: 356, minX: 160, maxX: 320, speed: 1.7 },
                { x: 900, minX: 832, maxX: 1088, speed: 1.8 }
            ],

            shield: {x: 330, y: 400, width: 24, height: 24}

        },
        {
            name: "Nivel 2 - Pradera II",
            textureRow: 1,
            textureStart: 0,
            textureCount: 8,
            backgroundColor: '#8bd2ee',
            map: [
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000CC0000000",
                "000000000C0000000000C0000000000000000000",
                "0000000011110000000111110000001111000C00",
                "0000000000000000000000000000000000000000",
                "00111100000011111000C0001111100000011100",
                "0000000CC0000000000000000000000000000000",
                "0000001111100000001111100000001111100000",
                "00C00000000000000000000000000000000000E0",
                "1111111111111111111111111111111111111111"
            ],

            enemies: [
                { x: 600, y: 356, minX: 576, maxX: 736, speed: 1.8 },
                { x: 800, y: 292, minX: 768, maxX: 928, speed: 2 }
            ],

            shield: {x: 544, y: 400, width: 24, height: 24}
        },
        {
            name: "Nivel 3 - Bosque",
            textureRow: 2,
            textureStart: 0,
            textureCount: 8,
            backgroundColor: '#83c7a7',
            map: [
    
                "0000000000000000000000000000000000000000",    
                "0000000000000000000000000000000000000000",    
                "0000000000000000000000000000000000000000",   
                "0000000000000000000000000000000000000000",    
                "0000000000000000000000000000000000000000",    
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000111110000000",
                "000000C000000000C00000000C000000000C0000",
                "0000011110000001111000001111100000111100",
                "0000000000C000000000C0000000000C00000000",
                "0111100001111100000111110000001111000000",
                "00000C000000000C00000000000C0000000C0000",
                "0000111110000011111000000011111000111100",
                "0C0000000000C0000000000C00000000000000E0",
                "1111111111111111111111111111111111111111"
            ],

            enemies: [
                { x: 480, y: 356, minX: 448, maxX: 608, speed: 1.8 },
                { x: 640, y: 292, minX: 608, maxX: 768, speed: 2 },
                { x: 930, minX: 896, maxX: 1088, speed: 2.2 }
            ],

            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 4 - Montaña",
            textureRow: 3, textureStart: 0, textureCount: 8,
            backgroundColor: '#c9e4f4',
            map: buildLevelMap(
                [[12,4,8],[10,9,13],[8,14,18],[10,19,23],[12,24,28],[10,30,34],[8,35,38],[6,34,37]],
                [[11,5],[11,25],[9,10],[9,20],[9,31],[7,15],[7,36]]
            ),
            enemies: [
                { x: 160, y: 356, minX: 128, maxX: 288, speed: 1.9 },
                { x: 480, y: 228, minX: 448, maxX: 608, speed: 2.1 },
                { x: 928, minX: 896, maxX: 1120, speed: 2.2 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 5 - Montes rocosos",
            textureRow: 4, textureStart: 0, textureCount: 8,
            backgroundColor: '#8995a5',
            map: buildLevelMap(
                [[12,3,7],[12,13,17],[12,23,27],[12,33,37],[10,7,11],[10,17,21],[10,27,31],[8,11,15],[8,21,25],[8,31,35]],
                [[11,4],[11,14],[11,24],[11,34],[9,9],[9,19],[9,29]]
            ),
            enemies: [
                { x: 448, y: 356, minX: 416, maxX: 576, speed: 2 },
                { x: 896, y: 292, minX: 864, maxX: 1024, speed: 2.2 },
                { x: 192, minX: 160, maxX: 320, speed: 2 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 6 - Cielo",
            textureRow: 5, textureStart: 0, textureCount: 8,
            backgroundColor: '#72c7f2',
            map: buildLevelMap(
                [[12,2,6],[12,12,16],[12,22,26],[12,32,36],[10,7,11],[10,17,21],[10,27,31],[8,3,7],[8,13,17],[8,23,27],[8,33,37],[6,18,22]],
                [[11,4],[11,14],[11,24],[11,34],[9,8],[9,18],[9,28]]
            ),
            enemies: [
                { x: 736, y: 356, minX: 704, maxX: 864, speed: 2.1 },
                { x: 576, y: 292, minX: 544, maxX: 704, speed: 2.2 },
                { x: 1088, y: 228, minX: 1056, maxX: 1216, speed: 2.4 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 7 - Templo ancestral",
            textureRow: 6, textureStart: 0, textureCount: 8,
            backgroundColor: '#756586',
            map: buildLevelMap(
                [[12,4,9],[12,17,22],[12,30,35],[10,8,13],[10,21,26],[10,34,38],[8,2,7],[8,15,20],[8,28,33],[6,34,38]],
                [[11,6],[11,19],[11,32],[9,10],[9,23],[7,4],[7,17]]
            ),
            enemies: [
                { x: 576, y: 356, minX: 544, maxX: 736, speed: 2.1 },
                { x: 512, y: 228, minX: 480, maxX: 672, speed: 2.3 },
                { x: 960, minX: 896, maxX: 1120, speed: 2.4 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 8 - Cueva",
            textureRow: 7, textureStart: 0, textureCount: 8,
            backgroundColor: '#344052',
            map: buildLevelMap(
                [[12,2,6],[12,10,14],[12,18,22],[12,26,30],[12,34,37],[10,5,9],[10,14,18],[10,23,27],[10,31,35],[8,9,13],[8,18,22],[8,27,31],[6,19,23]],
                [[11,4],[11,12],[11,20],[11,28],[11,35],[9,7],[9,16]]
            ),
            enemies: [
                { x: 608, y: 356, minX: 576, maxX: 736, speed: 2.2 },
                { x: 896, y: 228, minX: 864, maxX: 1024, speed: 2.5 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 9 - Puerto pirata",
            textureRow: 8, textureStart: 0, textureCount: 8,
            backgroundColor: '#d4ad78',
            map: buildLevelMap(
                [[12,3,8],[12,15,20],[12,27,32],[10,8,13],[10,20,25],[10,32,37],[8,2,7],[8,14,19],[8,26,31],[8,34,38],[6,31,36]],
                [[11,5],[11,17],[11,29],[9,10],[9,22],[9,34],[7,16]]
            ),
            enemies: [
                { x: 512, y: 356, minX: 480, maxX: 672, speed: 2.3 },
                { x: 1056, y: 292, minX: 1024, maxX: 1216, speed: 2.5 },
                { x: 192, minX: 160, maxX: 320, speed: 2.2 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        },
        {
            name: "Nivel 10 - Iceberg",
            textureRow: 9, textureStart: 0, textureCount: 8,
            backgroundColor: '#b9eaf5',
            map: buildLevelMap(
                [[12,3,7],[12,11,15],[12,19,23],[12,27,31],[12,35,38],[10,7,11],[10,15,19],[10,23,27],[10,31,35],[8,11,15],[8,19,23],[8,27,31],[8,35,38],[6,35,38]],
                [[11,5],[11,13],[11,21],[11,29],[9,9],[9,25],[7,36]]
            ),
            enemies: [
                { x: 640, y: 356, minX: 608, maxX: 768, speed: 2.4 },
                { x: 1152, y: 228, minX: 1120, maxX: 1248, speed: 2.7 },
                { x: 928, minX: 896, maxX: 1088, speed: 2.5 }
            ],
            shield: { x: 320, y: 400, width: 24, height: 24 }
        }
    ],

    // Estados del juego
    currentLevel: 0,
    gameMode: 'principal',
    completed: false,
    gameOver: false,
    transitionPending: false,
    transitionFailed: false,
    
    // Contador global de objetos recolectados en todos los niveles.
    itemsCollected: 0,
    totalItems: 79,

    // Identificadores de monedas recogidas durante la campaña.
    collectedCoinIds: [],

    // Monedas recogidas temporalmente en el nivel actual.
    pendingCoinIds: [],

    // Sistema de vidas e invencibilidad
    lives: 3,
    invulnerabilityTimer: 0,

    // Enemigos y escudo
    enemies: [],
    shield: null,
    shieldActive: false,
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
        game.transitionPending = false;
        game.transitionFailed = false;
        game.loadLevel(0);

    },

    // Función de carga de nivel
    loadLevel: function(levelIndex) {

        if (levelIndex >= game.levels.length) {
            game.completed = true;
            return;
        }

        game.currentLevel = levelIndex;

        // Limpiar las monedas temporales al cargar un nivel.
        game.pendingCoinIds = [];

        var levelShield = game.levels[levelIndex].shield;

        game.shield = {x: levelShield.x, y: levelShield.y, width: levelShield.width, height: levelShield.height,
            collected: false
        };

        game.shieldActive = false;

        // Copiar el mapa del nivel seleccionado
        game.tileMap = game.levels[levelIndex].map.slice();

        // Identificar las monedas originales del nivel.
        game.currentLevelCoinIds = [];

        var originalMap = game.levels[levelIndex].map;

        for (var row = 0; row < originalMap.length; row++) {
            for (var col = 0; col < originalMap[row].length; col++) {
        
                if (originalMap[row][col] === 'C') {

                    game.currentLevelCoinIds.push('nivel' + (levelIndex + 1) + '_fila' + row + '_columna' + col);
        
                }
            }
        }

        // Carga de enemigos
        game.enemies = game.levels[levelIndex].enemies.map(function(enemy) {
            return {
                x: enemy.x,
                y: enemy.y !== undefined ? enemy.y : 14 * game.tileSize - 28,            
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

    // Función que devuelve al personaje al punto de partida
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

    // Función de progresión en niveles
    advanceLevel: function() {

        if (game.transitionPending || game.transitionFailed ||
            !window.gameSession || !gameSession.playerId) {
                
            return;
        }

        game.transitionPending = true;
        var completedLevel = game.currentLevel + 1;
        var mode = game.gameMode;

        gameSession.completeLevel(completedLevel, game.lives, game.pendingCoinIds.slice())
            .then(async function(result) {

                game.lives = result.lives;
                game.itemsCollected = result.total_coins;

                if (completedLevel < game.levels.length) {

                    await gameSession.startLevel(completedLevel + 1, mode);

                }

                game.loadLevel(game.currentLevel + 1);
                game.transitionPending = false;

                if (game.completed) {

                    gameSession.showEnd('¡Campaña completada! El progreso quedó guardado.');

                }
            })
            .catch(function(error) {
                game.transitionPending = false;
                game.transitionFailed = true;
                gameSession.report('No se pudo guardar el nivel: ' + error.message +
                    ' Recarga para recuperar el último progreso confirmado.');
            });

    },

    // Función de recolección de objetos
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

                    var coinId = game.currentLevelCoinIds.find(function(id) {
    
                        return id === 'nivel' + (game.currentLevel + 1) + '_fila' + row + '_columna' + col;

                    });

                    if (coinId && !game.pendingCoinIds.includes(coinId)) {
                        game.pendingCoinIds.push(coinId);
                    }
                
                    game.itemsCollected++; 

                }
            }
        }
    },

    // Función de recolección del escudo
    checkShieldCollection: function() {
    
        if (!game.shield || game.shield.collected) {
            return;
        }

        var player = game.player;
        var shield = game.shield;

        var overlaps =
        player.x < shield.x + shield.width &&
        player.x + player.width > shield.x &&
        player.y < shield.y + shield.height &&
        player.y + player.height > shield.y;

        if (overlaps) {

            shield.collected = true;
            game.shieldActive = true;

        }
    },

    // Función que verifica la culminación de un nivel
    checkLevelExit: function() {

        var player = game.player;
        var tileSize = game.tileSize;
     
        for (var row = 0; row < game.tileMap.length; row++) {
        
            var col = game.tileMap[row].indexOf('E');

            if (col !== -1) {
            
                var exitX = col * tileSize;          
                var exitY = row * tileSize;
         
                var overlaps =
                player.x < exitX + tileSize &&
                player.x + player.width > exitX &&
                player.y < exitY + tileSize &&
                player.y + player.height > exitY;
          
                if (overlaps && player.grounded) {

                    game.advanceLevel();

                }

                return;
            }
        }
    },

    // Función de Tunneling
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

    // Función de detección de colisión estándar
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

                if (game.tileMap[row] && game.tileMap[row][col] === '1') {

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

    // Función que moviliza los enemigos
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

    // Función de detección de enemigos con colisión
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

    // Función de substracción de vidas
    takeDamage: function() {
   
        if (game.shieldActive) {
            game.shieldActive = false;       
            game.invulnerabilityTimer = 90;
            return;
        }

        game.lives--;

        if (game.lives <= 0) {
            game.lives = 0;
            game.gameOver = true;
            if (window.gameSession && gameSession.playerId) {
                gameSession.showEnd('Registrando derrota…');
                gameSession.post('/api/progress/' + gameSession.playerId + '/defeat')
                    .then(function() {
                        gameSession.showEnd('Derrota registrada. La campaña volvió al inicio.');
                    })
                    .catch(function(error) {
                        gameSession.showEnd('No se pudo registrar la derrota: ' + error.message);
                    });
            }
            return;
        }

        if (window.gameSession && gameSession.playerId) {
            gameSession.saveCheckpoint(game.lives).catch(function(error) {
                gameSession.report('No se pudieron guardar las vidas: ' + error.message);
            });
        }

        // Tiempo de invulnerabilidad.
        game.invulnerabilityTimer = 90;

        // Volver al punto inicial.
        game.resetPlayerPosition();

    },

    // Función de control de las animaciones
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
    
    // Función de actualización del juego
    update: function() {

        // No actualizar el juego si se completaron los niveles
        if (game.completed || game.gameOver || game.transitionPending) {

            return;

        }

        if (game.invulnerabilityTimer > 0) {

            game.invulnerabilityTimer--;

        }

        var player = game.player;
        var canvas = display.canvas;
        var mapWidth = game.tileMap[0].length * game.tileSize;

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
        
        if (player.x + player.width > mapWidth) {
            player.x = mapWidth - player.width;
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
        game.checkShieldCollection();
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
