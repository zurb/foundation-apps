# image = document.getElementById('resizableImageByButtons')
# button1 = document.getElementById('resizeImageButton1')
# button2 = document.getElementById('resizeImageButton2')
# button3 = document.getElementById('resizeImageButton3')

class ImageResizer
  constructor: ( @image, @buttons, @addResizePropertyToImage )->

    if @addResizePropertyToImage == true #Object.is( true, @addResizePropertyToImage )
      image.cssText = "resize: both;"

    for button in @buttons
      button.addEventListener('click', =>
        @reactToButton(button)
      )

  reactToButton: (button)->
    console.log("Button used is", button)
    resizeValue = button.dataset.resizeValue
    console.log("Resize value is:", resizeValue)

    if resizeValue?
      image.cssText = "width: #{resizeValue}"
