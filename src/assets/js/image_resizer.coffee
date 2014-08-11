class ImageResizer
  constructor: ( @image, @buttons, @addResizePropertyToImage )->
    if @addResizePropertyToImage == true #Object.is( true, @addResizePropertyToImage )
      @image.style.reset = "both"

    for button in @buttons
      # Do an IIFE in CoffeeScript w/o the need to use void or the traditional ways of doing IIFEs
      do (button)=>
        button.addEventListener('click', =>
          @reactToButton(button)
        )

  reactToButton: (button)->
    console.log("Button used is", button)
    resizeValue = button.dataset.resizeValue
    console.log("Resize value is:", resizeValue)

    @image.style.width  = "#{resizeValue}" unless !resizeValue

# exampleOfAnInstanceOfImageResizer  = new ImageResizer( document.getElementById('resizableImageByButtons'), [ document.getElementById('resizeImageButton1'), document.getElementById('resizeImageButton2'), document.getElementbyId('resizeImageButton3')] )
