FoundationApps.offcanvas = {
  init: function(options) {
    var _this = this;
    this.options = $.extend({}, options);
    this.$allMenus = $('[data-offcanvas]');

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

    // Event handler for closing on frame click
    $('.frame').click(function() {
      // Desired behavior: all click events are disabled while an off-canvas menu is open
      // Instead the click just closes the open menu
      _this.$allMenus.removeClass('is-active');
      return false;
    });
  },

  open: function(sel) {
    $elem = $(sel);

    console.log($elem);

    // Close other menus
    this.$allMenus.removeClass('is-active');
    // Toggle the targeted menu
    $elem.addClass('is-active');
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