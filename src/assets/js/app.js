$('*[data-motion-id="example1"]').on('click', function(e){
  e.preventDefault();
  $('#example1').toggleClass('motion');
 //  setTimeout(function () { 
	//   $('#example1').removeClass('motion');
	// }, 1000);
});

$('*[data-motion-id="example2"]').on('click', function(e){
  e.preventDefault();
  $('#example2').toggleClass('motion');
});

$('*[data-motion-id="example3"]').on('click', function(e){
  e.preventDefault();
  $('#example3').toggleClass('motion');
});

$('*[data-motion-id="example4"]').on('click', function(e){
  e.preventDefault();
  $('#example4').toggleClass('motion');
});

$('*[data-motion-id="example5"]').on('click', function(e){
  e.preventDefault();
  $('#example5').toggleClass('motion');
});

$('*[data-motion-id="example6"]').on('click', function(e){
  e.preventDefault();
  $('#example6').toggleClass('motion');
});

$('*[data-motion-id="example7"]').on('click', function(e){
  e.preventDefault();
  $('#example7').toggleClass('motion');
});

$('*[data-motion-id="example8"]').on('click', function(e){
  e.preventDefault();
  $('#example8').toggleClass('motion');
});

$('*[data-motion-id="example9"]').on('click', function(e){
  e.preventDefault();
  $('#example9').toggleClass('motion');
});

$('*[data-motion-id="example10"]').on('click', function(e){
  e.preventDefault();
  $('#example10').toggleClass('motion');
  
});

$('*[data-motion-id="example11"]').on('click', function(e){
  e.preventDefault();
  $('#example11').toggleClass('motion');
  
});

$('*[data-motion-id="example12"]').on('click', function(e){
  e.preventDefault();
  $('#example12').toggleClass('motion');
  
});

// $('*[data-animation-id="example13"]').on('click', function(e){
//   e.preventDefault();
//   $('#example13').addClass('animate');
//   setTimeout(function () { 
//     $('#example13').removeClass('animate');
//   }, 2000);
// });

$('*[data-animation-id="example15"]').on('click', function(e){
  e.preventDefault();
  $('#example15').toggleClass('motion error');
  $('#example16').toggleClass('motion');
});

$('*[data-transition-id="compose-window"]').on('click', function(e){
  e.preventDefault();
  $('#compose-window').toggleClass('motion');
});

// Panels
$('[data-panel-toggle]').click(function() {
  var targetPanel = $(this).attr('data-panel-toggle');
  if (targetPanel.length === 0) {
    $(this).closest('[data-panel]').toggleClass('is-active');
  }
  else {
    $('#'+$(this).attr('data-panel-toggle')).toggleClass('is-active');
  }
  return false;
});

// Popup menus
$('[data-popup-toggle]').click(function() {
  $(this).next('[data-popup]').toggleClass('is-active');
});

// Off-canvas
$('[data-offcanvas-toggle]').click(function(event) {
  event.stopPropagation();
  var $targetCanvas = $('#'+$(this).attr('data-offcanvas-toggle'));
  // Toggle the targeted menu
  $targetCanvas.toggleClass('is-active');
  // Close other menus
  $('[data-offcanvas]').not($targetCanvas).removeClass('is-active');
});
// Desired behavior: all click events are disabled while an off-canvas menu is open
// Instead the click just closes the open menu
if ($('[data-offcanvas]').length > 0) {
  $('.frame').click(function() {
    $('[data-offcanvas]').removeClass('is-active');
    return false;
  });
}