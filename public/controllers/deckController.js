var myApp = angular.module('myApp', []);
myApp.controller('appCtrl', ['$scope', '$http', function($scope, $http) {

    var refresh = function (){
      $http.get('/deck').then(function(response) {
        console.log("I got the data i wanted");
        $scope.deck = response.data;
        $scope.card = null;
        for (var i = 0; i < response.data.length; i++) {
          $scope.number = parseInt(response.data[i].quantity);
          $scope.getNumber = function(num) {
              return new Array(num);
          }
        };

    })}



    refresh();

    $scope.addCard = function(){
      let cardToAdd = $scope.card
      console.log(cardToAdd);
      $http.post('/deck',cardToAdd).then(function(response){
        console.log(response);
        refresh();
      })
    }
    $scope.removeCard = function(id) {
      console.log(id);
      $http.delete('/deck/' + id)
      .then(refresh());
    };

    $scope.editCard = function(id){
      console.log(id);
      $http.get('/deck/' + id)
      .then(function(response){
        $scope.card = response.data;
      })
    };

    $scope.update = function() {
      console.log($scope.card._id);
      $http.put('/deck/' + $scope.card._id, $scope.card)
      .then(refresh());
    }

    $scope.deselect = function() {
      $scope.card = null;
    }
}]);
