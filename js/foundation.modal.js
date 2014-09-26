FoundationApps.modal = {
  /*
    Initialize the plugin, importing user options, creating a modal overlay, and adding event handlers.

    @param {object} options - User-defined options.
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
    Open a modal.

    @param {(string|object)} sel - A selector string, DOM object, or jQuery object representing the modal to be opened. If multiple modals are found, only the first one will be opened.
  */
  open: function(sel) {
    // Add the active class to the overlay and the modal, and then trigger the modal opened event.
    this.overlay.classList.add('is-active');
    $(sel).eq(0)
      .addClass('is-active')
      .trigger('foundation.modal.opened');
  },
  /*
    Close a modal. It's like the above function but in reverse.

    @param {(string|object)} sel - A selector string, DOM object, or jQuery object representing the modal to be closed. If multiple modals are found, only the first one will be opened.
  */
  close: function(sel) {
    this.overlay.classList.remove('is-active');
    $(sel).eq(0)
      .removeClass('is-active')
      .trigger('foundation.modal.closed');
  },

  /*
    Add an callback to be run when a modal is opened. The callback takes one parameter, which is the event object.

    @param {(string|object)} sel - A selector string, DOM object, or jQuery object representing a modal.
    @param {function} fn - Callback function to be run on open.
  */
  onOpen: function(sel, fn) {
    $(sel).on('foundation.modal.opened', function(event) {
      // Pass in "this" as the modal, and the event object
      fn.apply(this, [event]);
    });
  },
  /*
    Add an callback to be run when a modal is closed. The callback takes one parameter, which is the event object.

    @param {(string|object)} sel - A selector string, DOM object, or jQuery object representing a modal.
    @param {function} fn - Callback function to be run on close.
  */
  onClose: function(sel, fn) {
    $(sel).on('foundation.modal.closed', function(event) {
      fn.apply(this, [event]);
    });
  }
}