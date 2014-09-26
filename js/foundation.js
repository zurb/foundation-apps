/*
  This is the global object for Foundation plugins.
  
  Individual plugins will be initialized in this function, and options can be sent to each one.
  Helper functions used by all plugins will also be defined here.
*/
FoundationApps = {
  findParent: function(elem, attr) {
    for (
      var foundIt = false, target = 'data-'+attr;
      elem !== document.body;
      elem = elem.parentNode
    ) {
      foundIt = elem.hasAttribute(target);
      if (foundIt) return elem;
    }
    return null;
  },
  init: function() {
    // Bein' hacky
    $.fn.on = function() {};
    
    viewportUnitsBuggyfill.init();
    this.modal.init();
    this.offcanvas.init();
    this.popup.init();
  }
}