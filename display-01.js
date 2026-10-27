var display = {

  canvas: null,
  context: null,

  init: function() {
    display.canvas = document.querySelector('canvas');
    display.context = display.canvas.getContext('2d');
  },
  
  draw: function(game) {
    display.context.clearRect(0, 0, display.canvas.width, display.canvas.height);
    display.context.fillStyle = 'red';
    display.context.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
  }
};