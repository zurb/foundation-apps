$('*[data-animation-id="example1"]').on('click', function(e){
  e.preventDefault();
  $('#example1').addClass('animate');
  setTimeout(function () { 
	  $('#example1').removeClass('animate');
	}, 1000);
});

$('*[data-animation-id="example2"]').on('click', function(e){
  e.preventDefault();
  $('#example2').addClass('animate');
  setTimeout(function () { 
	  $('#example2').removeClass('animate');
	}, 1000);
});

$('*[data-animation-id="example3"]').on('click', function(e){
  e.preventDefault();
  $('#example3').addClass('animate');
  setTimeout(function () { 
	  $('#example3').removeClass('animate');
	}, 1000);
});

$('*[data-animation-id="example4"]').on('click', function(e){
  e.preventDefault();
  $('#example4').addClass('animate');
  setTimeout(function () { 
	  $('#example4').removeClass('animate');
	}, 1000);
});

$('*[data-animation-id="example5"]').on('click', function(e){
  e.preventDefault();
  $('#example5').addClass('animate');
  setTimeout(function () { 
	  $('#example5').removeClass('animate');
	}, 1000);
});

$('*[data-animation-id="example6"]').on('click', function(e){
  e.preventDefault();
  $('#example6').addClass('animate');
  setTimeout(function () { 
	  $('#example6').removeClass('animate');
	}, 2000);
});

$('*[data-animation-id="example7"]').on('click', function(e){
  e.preventDefault();
  $('#example7').toggleClass('animate');
});

$('*[data-animation-id="example8"]').on('click', function(e){
  e.preventDefault();
  $('#example8').toggleClass('animate');
});

$('*[data-animation-id="example9"]').on('click', function(e){
  e.preventDefault();
  $('#example9').toggleClass('animate');
});

$('*[data-animation-id="example10"]').on('click', function(e){
  e.preventDefault();
  $('#example10').addClass('animate');
  setTimeout(function () { 
    $('#example10').removeClass('animate');
  }, 1400);
});

$('*[data-animation-id="example11"]').on('click', function(e){
  e.preventDefault();
  $('#example11').addClass('animate');
  setTimeout(function () { 
    $('#example11').removeClass('animate');
  }, 1400);
});

$('*[data-animation-id="example12"]').on('click', function(e){
  e.preventDefault();
  $('#example12').addClass('animate');
  setTimeout(function () { 
    $('#example12').removeClass('animate');
  }, 2200);
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
  $('#example15').addClass('animate error');
  $('#example16').addClass('animate error');
  setTimeout(function () { 
    $('#example15').removeClass('animate error');
    $('#example16').removeClass('animate error');
  }, 2200);
});

$('*[data-transition-id="compose-window"]').on('click', function(e){
  e.preventDefault();
  $('#compose-window').toggleClass('animate');
});

$('.middle')