ImageResizer, button1, button2, button3, image;

image = document.getElementById('resizeableImageByButtons');

button1 = document.getElementById('resizeImageButton1');

button2 = document.getElementById('resizeImageButton2');

button3 = document.getElementbyId('resizeImageButton3');

ImageResizer = (function() {
  function ImageResizer(image, buttons) {
        var button, _i, _len;
            this.image = image != null ? image : image;
                this.buttons = buttons != null ? buttons : [button1, button2, button3];
                if (Object.is(true, addResizePropertyToImage)) {
                        image.cssText = "resize: both;";

                }
                for (_i = 0, _len = buttons.length; _i < _len; _i++) {
                        button = buttons[_i];
                        button.addEventListener('click', (function(_this) {
                          return function() {
                                      return _this.reactToButton(button);

                          };

                        })(this));

                }

  }

  ImageResizer.prototype.reactToButton = function(button) {
        var resizeValue;
            resizeValue = button.dataset.resizeValue;
            if (resizeValue !== void 0 & resizeValue !== null) {
                    return image.cssText = "width: ${resizeValue}";

            }

  };

    return ImageResizer;


})();
