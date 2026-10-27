var engine = {

  game: null,
  init: function(game) {
    engine.game = game;
  },

  run: function() {
    requestAnimationFrame(engine.run);
    engine.game.update();
    display.draw(engine.game);
  }
  
};