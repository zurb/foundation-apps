FoundationApps = {};

FoundationApps.notify = function(options) {
  options = $.extend({
    title:    "Default title",
    body:     "This is the body of the message",
    timeout:  3000
  }, options);

  var note = document.createElement('div');
  note.classList.add('notification');
  note.innerHTML = '<h1>'+options.title+'</h1><p>'+options.body+'</p>';

  document.querySelector('body').appendChild(note);
  
  // 50ms delay so the transition actually triggers
  window.setTimeout(function() {
    note.classList.add('is-active');

    // Timeout to hide notification
    window.setTimeout(function() {
      note.classList.remove('is-active');

      // Remove the element once the thing animates out
      $(note).on('transitionend webkitTransitionEnd', function() {
        $(this).remove();
      });
    }, options.timeout);
  }, 50);

  // Native notifications
  var fireNote = function() {
    var desktopNote = new Notify(options.title, {
      body: options.body
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

$('.button').on('click', function() {
  FoundationApps.notify({});
});