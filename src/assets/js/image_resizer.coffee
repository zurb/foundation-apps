# Todo rewrite w/ Traceur once that's been cleared  or be part of app.js after being imported as a Node Module  if browserify is used alternatively to have these scripts loaded in a sane way.
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

window.onload = ->
  image = document.getElementById('resizableImageByButtons')
  button1 = document.getElementById('resizeImageButton1')
  button2 = document.getElementById('resizeImageButton2')
  button3 = document.getElementById('resizeImageButton3')

  interchange_example = new ImageResizer( image, [ button1, button2, button3 ], true)
