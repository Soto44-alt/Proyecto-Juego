var game = {

  player: {
    x: 0,
    y: 0,
    width: 32,
    height: 32
  },

  init: function() {
    game.player.x = display.canvas.width / 2;
    game.player.y = display.canvas.height / 2;
  },
  
  update: function() {
    if (controller.keys['ArrowRight']) game.player.x += 5;
    if (controller.keys['ArrowLeft'])  game.player.x -= 5;
    if (controller.keys['ArrowUp'])    game.player.y -= 5;
    if (controller.keys['ArrowDown'])  game.player.y += 5;
  }
};