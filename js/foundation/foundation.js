/*
  This is the global object for Foundation plugins.

  Individual plugins will be initialized in this function, and options can be sent to each one.
  Helper functions used by all plugins will also be defined here.
*/
FoundationApps = {
  // jqlite doesn't have a closest() function so I made one
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
    FastClick.attach(document.body);
    viewportUnitsBuggyfill.init();
    this.modal.init();
    this.offcanvas.init();
    this.popup.init();

    // The rest of the plugins
    // Panels
    $('[data-panel-toggle]').click(function() {
      var targetPanel = $(this).attr('data-panel-toggle');
      if (targetPanel.length === 0) {
        $(this).closest('[data-panel]').toggleClass('is-active');
      }
      else {
        $('#'+$(this).attr('data-panel-toggle')).toggleClass('is-active');
      }
      return false;
    });

    // Popup menus
    $('[data-popup-toggle]').click(function() {
      $(this).next('[data-popup]').toggleClass('is-active');
      return false;
    });
  }
}
