var controller = {

  keys: {},

  init: function() {

    document.addEventListener('keydown', function(e) {
      controller.keys[e.code] = true;
    });
    
    document.addEventListener('keyup', function(e) {
      controller.keys[e.code] = false;
    });
  }
};