FoundationApps.popup = {
  init: function() {
    var _this = this;
    this.tethers = {};

    $('[data-popover]').each(function() {
      $(this).addClass('tether-element');
      _this.tethers[this.id] = null;
    });

    $('[data-popover-toggle]').click(function(event) {
      event.preventDefault();
      var targetID = this.getAttribute('data-popover-toggle');

      if (_this.tethers[targetID] === null) {
        var element = document.getElementById(targetID);
        var target  = this;

        var tether = new Tether({
          element: element,
          target: target,
          attachment: 'top center',
          offset: '-30px 0',
          enable: false
        });

        _this.tethers[targetID] = tether;
        console.log(_this.tethers);
      }
      else if (this.classList.contains('tether-enabled')) {
        _this.close(targetID);
      }
      else {
        _this.open(targetID);
      }
    });
  },

  open: function(id) {
    // document.getElementById(id).classList.add('tether-enabled');
    this.tethers[id].enable();
  },
  close: function(id) {
    // document.getElementById(id).classList.remove('tether-enabled');
    this.tethers[id].disable();
  }
}