FoundationApps.notify = function(options) {
  options = $.extend({
    title:       "Default title",
    body:        "This is the body of the message",
    timeout:     3000,
    customClass: "top-right",
    closable:    true,
    onClick:     null,
    onClose:     null
  }, options);

  // Native notification
  var desktopNote = null;

  // Create an empty element and give it the right classes
  var note = document.createElement('div');
  note.classList.add('notification');
  note.classList.add(options.customClass);

  // Add the content
  note.innerHTML = '<h1>'+options.title+'</h1><p>'+options.body+'</p>';

  // Add a close button if needed
  if (options.closable) {
    var noteClose = $('<a class="close-button">&times;</a>');
    noteClose.click(function() {
      note.close();
    });
    note.appendChild(noteClose[0]);
  }

  // Custom method to destroy the notification
  note.close = function() {
    console.log(this);
    this.classList.remove('is-active');

    // Remove the element once the thing animates out
    $(this).on('transitionend webkitTransitionEnd', function() {
      $(this).remove();
    });

    // Remove the native notification if it exists
    if (desktopNote instanceof Notify) {
      desktopNote.close();
    }
  }

  // Add event listeners
  if (typeof options.onClick === 'function') {
    $(note).click(function(event) {
      if (!$(event.target).hasClass('close-button')) {
        options.onClick();
      }
    });
  }
  if (options.closable && typeof options.onClose === 'function') {
    $(note).children('.close-button').click(function() {
      options.onClose();
    });
  }

  // Add the element to the DOM
  document.querySelector('body').appendChild(note);
  
  // 50ms delay so the transition actually triggers
  window.setTimeout(function() {
    note.classList.add('is-active');

    // Timeout to hide notification
    if (options.timeout > 0) {
      window.setTimeout(function() {
        note.close();
      }, options.timeout);
    }
  }, 50);

  // Native notifications
  var fireNote = function() {
    desktopNote = new Notify(options.title, {
      body:        options.body,
      notifyClick: function() {
        options.onClick();
      },
      notifyClose: function() {
        note.close();
        options.onClose();
      }
    });
    desktopNote.show();
  }
  if (Notify.needsPermission) {
    Notify.requestPermission(function() {
      fireNote();
    });
  }
  else {
    fireNote();
  }
}