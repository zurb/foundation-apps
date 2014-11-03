FoundationApps.init();

FoundationApps.modal.onOpen('#theModal', function() {
  FoundationApps.notify({
    title: 'You opened a modal!',
    body: 'I can\'t even.',
    timeout: 0
  });
});

$('#newMessage').click(function(event) {
  event.preventDefault();

  FoundationApps.notify({
    title: "You clicked the New Message button.",
    body: "And this notification has an extended description. How long can this string get, anyway?",
    timeout: 0,
    onClick: function() {
      console.log("Click'd.");
    },
    onClose: function() {
      console.log("Clos'd.");
    }
  });
});

// angular.module('application')
//   .controller('HNController', ['$scope', '$http', function($scope, $http) {
//     $scope.stories = [];

//     $scope.stories = [
//       'Story One',
//       'Story Too',
//       'Story Three',
//       'Story Four',
//       'Story Five',
//       'Story Six',
//       'Story Sevem'
//     ];

    // $http({method: 'GET', url: 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'})
    //   .success(function(data, status, headers, config) {
    //     for (var i = 0; i < 10; i++) {
    //       $http.get('https://hacker-news.firebaseio.com/v0/item/'+data[i]+'.json?print=pretty')
    //         .success(function(storyData, status, headers, config) {
    //           $scope.stories.push(storyData);
    //         });
    //     }
    //   });
  // }]);

// $('*[data-motion-id="example1"]').on('click', function(e){
//   e.preventDefault();
//   $('#example1').toggleClass('motion');
//  //  setTimeout(function () {
// 	//   $('#example1').removeClass('motion');
// 	// }, 1000);
// });

// $('*[data-motion-id="example2"]').on('click', function(e){
//   e.preventDefault();
//   $('#example2').toggleClass('motion');
// });

// $('*[data-motion-id="example3"]').on('click', function(e){
//   e.preventDefault();
//   $('#example3').toggleClass('motion');
// });

// $('*[data-motion-id="example4"]').on('click', function(e){
//   e.preventDefault();
//   $('#example4').toggleClass('motion');
// });

// $('*[data-motion-id="example5"]').on('click', function(e){
//   e.preventDefault();
//   $('#example5').toggleClass('motion');
// });

// $('*[data-motion-id="example6"]').on('click', function(e){
//   e.preventDefault();
//   $('#example6').toggleClass('motion');
// });

// $('*[data-motion-id="example7"]').on('click', function(e){
//   e.preventDefault();
//   $('#example7').toggleClass('motion');
// });

// $('*[data-motion-id="example8"]').on('click', function(e){
//   e.preventDefault();
//   $('#example8').toggleClass('motion');
// });

// $('*[data-motion-id="example9"]').on('click', function(e){
//   e.preventDefault();
//   $('#example9').toggleClass('motion');
// });

// $('*[data-motion-id="example10"]').on('click', function(e){
//   e.preventDefault();
//   $('#example10').toggleClass('motion');

// });

// $('*[data-motion-id="example11"]').on('click', function(e){
//   e.preventDefault();
//   $('#example11').toggleClass('motion');

// });

// $('*[data-motion-id="example12"]').on('click', function(e){
//   e.preventDefault();
//   $('#example12').toggleClass('motion');

// });

// $('*[data-animation-id="example13"]').on('click', function(e){
//   e.preventDefault();
//   $('#example13').addClass('animate');
//   setTimeout(function () {
//     $('#example13').removeClass('animate');
//   }, 2000);
// });

// $('*[data-animation-id="example15"]').on('click', function(e){
//   e.preventDefault();
//   $('#example15').toggleClass('motion error');
//   $('#example16').toggleClass('motion');
// });

// $('*[data-transition-id="compose-window"]').on('click', function(e){
//   e.preventDefault();
//   $('#compose-window').toggleClass('motion');
// });
