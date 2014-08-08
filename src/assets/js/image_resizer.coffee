image = document.getElementById('resizeableImageByButtons')
button1 = document.getElementById('resizeImageButton1')
button2 = document.getElementById('resizeImageButton2')
button3 = document.getElementbyId('resizeImageButton3')

class ImageResizer
  constructor: ( @image = image, @buttons = [ button1, button2, button3  ], @addResizePropertyToImage )->

    if Object.is( true, @addResizePropertyToImage )
      image.cssText = "resize: both;"


    for button in buttons
      button.addEventListener('click', =>
        @reactToButton(button)
      )
  reactToButton: (button)->
    resizeValue = button.dataset.resizeValue

    if (resizeValue != undefined & resizeValue != null)
      image.cssText = "width: ${resizeValue}"


