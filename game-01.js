var game = {

    gravity: 0.5,
    
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
        
        if (player.y + player.height >= canvas.height) {
            player.y = canvas.height - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    }
};