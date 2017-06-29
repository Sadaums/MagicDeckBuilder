var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider){

  $routeProvider
  .when('/decks', {
    templateUrl: 'views/deck.html',
    controller: 'deckController'
  })
  .when('/finder', {
    templateUrl: 'views/cardFinder.html',
    controller: 'cardSelectController'
  })
  .when('/select', {
    templateUrl: 'views/cardSelect.html'
  })
  .when('/viewer', {
    templateUrl: 'views/cardViewer.html'
  })
  .when('/list', {
    templateUrl: 'views/deckList.html'
  })
  .when('/login', {
    templateUrl: 'views/login.html'
  })
  .when('/newdeck', {
    templateUrl: 'views/newDeck.html'
  })
  .otherwise({
    redirectTo: '/decks'
  })

}])

myApp.controller('cardSelectController',['$scope', function($scope){

  const standard = ['Amonkhet', 'Aether Revolt', 'Kaladesh', 'Eldritch Moon', 'Shadows over Innistrad', 'Oath of the Gatewatch', 'Battle For Zendikar'];
  $scope.standard = standard;
  const colors = ['Red', 'Green', 'Black', 'White', 'Blue'];
  $scope.colors = colors;
  const types = ['Instant', 'Sorcery', 'Artifact', 'Creature', 'Enchantment', 'Land', 'Planeswalker']
  $scope.types = types;
  const manaCost = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
  $scope.manaCost = manaCost;



  $scope.getCards = function(name, color, cost, type, subType, set){
    let cardToAdd = $scope.card
    console.log(cardToAdd);
  }


}])

myApp.controller('deckController', ['$scope', '$http', function($scope, $http) {

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

    $scope.increaseQuantity = function (id) {
      $http.get('/deck/' + id)
      .then(function(response){
        let editCard = response.data;
        editCard.quantity++;
        console.log(editCard);
        $http.put('/deck/' + editCard._id, editCard)
        .then(refresh());
      })

    };

    $scope.decreaseQuantity = function (id) {
      $http.get('/deck/' + id)
      .then(function(response){
        let editCard = response.data;
        editCard.quantity--;
        console.log(editCard);
        $http.put('/deck/' + editCard._id, editCard)
        .then(refresh());
      })

    };

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
