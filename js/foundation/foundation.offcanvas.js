FoundationApps.offcanvas = {
  init: function(options) {
    var _this = this;
    this.options = $.extend({}, options);
    this.$allMenus = $('[data-offcanvas]');

    // Add a class to the body if an off-canvas is detected
    if (this.$allMenus.length > 0) {
      document.body.classList.add('has-off-canvas');
    }

    // Event handler for elements that toggle the menu
    $('[data-offcanvas-toggle]').click(function(event) {
      // Prevent default behavior
      event.stopPropagation();

      // Find the target canvas
      var $targetMenu = $('#'+$(this).attr('data-offcanvas-toggle'));

      if (!$targetMenu.hasClass('is-active')) {
        _this.open($targetMenu);
      }
      else {
        _this.close($targetMenu);
      }

      return false;
    });
  },

  open: function(sel) {
    var _this = this;
    $elem = $(sel);

    // Close other menus
    this.$allMenus.removeClass('is-active');
    // Toggle the targeted menu
    $elem.addClass('is-active');

    // Clicks on the frame will close the menu
    var frame = document.querySelector('.frame');
    var closeHandler = function() {
      _this.$allMenus.removeClass('is-active');
      frame.removeEventListener('click', closeHandler);
      return false;
    }
    frame.addEventListener('click', closeHandler);
  },
  close: function(sel) {
    $elem = $(sel);
    $elem.removeClass('is-active');
  },

  onOpen: function(sel, fn) {

  },
  onClose: function(sel, fn) {

  }
}
