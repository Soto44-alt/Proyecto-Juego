var controller = {

  keys: {},

  init: function() {

    document.addEventListener('keydown', function(e) {
      controller.keys[e.code] = true;
      
      if (
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'Space'
      ) {
        e.preventDefault();
      }
    });
    
    document.addEventListener('keyup', function(e) {
      controller.keys[e.code] = false;
    });
  }
};