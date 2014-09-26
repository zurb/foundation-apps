FoundationApps.modal = {
  /*
    Initialize the plugin, adding event handlers to modal triggers.
  */
  init: function(options) {
    this.options = $.extend({
      overlayClass: 'modal-overlay'
    }, this.options);
    this.overlay = null;
    var _this = this;

    // Modal triggers
    $('[data-modal-open]').click(function() {
      _this.open('#'+$(this).attr('data-modal-open'));
    });

    // Create a single modal overlay to use when modals are fired
    if ($('[data-modal]').length > 0) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add(this.options.overlayClass);
      document.body.appendChild(this.overlay);
    }

    $('[data-modal]').each(function() {
      _this.overlay.appendChild(this);
    });
    $('[data-modal] [data-close]').click(function() {
      _this.close(FoundationApps.findParent(this, 'modal'));
    });
  },

  /*
    Open a modal
  */
  open: function(sel) {
    this.overlay.classList.add('is-active');
    $(sel)
      .addClass('is-active')
      .trigger('foundation.modal.opened');
  },
  /*
    Close a modal
  */
  close: function(sel) {
    this.overlay.classList.remove('is-active');
    $(sel)
      .removeClass('is-active')
      .trigger('foundation.modal.closed');
  },

  /*
    Add an event handler for when a modal is opened
  */
  onOpen: function(sel, fn) {
    $(sel).on('foundation.modal.opened', function(event) {
      fn.apply(this, [event]);
    });
  },
  /*
    Add an event handler for when a modal is closed
  */
  onClose: function(sel, fn) {
    $(sel).on('foundation.modal.closed', function(event) {
      fn.apply(this, [event]);
    });
  }
}