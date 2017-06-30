var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider){

  $routeProvider
  .when('/deck', {
    templateUrl: 'views/deck.html',
    controller: 'deckController'
  })
  .when('/finder', {
    templateUrl: 'views/cardFinder.html',
    controller: 'cardSelectController'
  })
  .when('/select', {
    templateUrl: 'views/cardSelect.html',
    controller: 'cardSelectController'
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
    redirectTo: '/deck'
  })

}])

myApp.controller('cardSelectController',['$scope', '$http', '$location', function($scope, $http, $location){

  const standard = ['Amonkhet', 'Aether Revolt', 'Kaladesh', 'Eldritch Moon', 'Shadows over Innistrad', 'Oath of the Gatewatch', 'Battle For Zendikar'];
  $scope.standard = standard;
  const colors = ['Red', 'Green', 'Black', 'White', 'Blue'];
  $scope.colors = colors;
  const types = ['Instant', 'Sorcery', 'Artifact', 'Creature', 'Enchantment', 'Land', 'Planeswalker']
  $scope.types = types;
  const manaCost = ['0','1','2','3','4','5','6','7','8','9','10','11','12'];
  $scope.manaCost = manaCost;


  $scope.getCards = function(card){
    let requestCard = {
      'name': null,
      'color': null,
      'cmc': null,
      'type': null,
      'subType': null,
      'set': null
    };
    if (card.name) {
      requestCard.name = card.name
    };
    if (card.color) {
      requestCard.color = card.color
    };
    if (card.cost) {
      requestCard.cmc = card.cost
    };
    if (card.type) {
      requestCard.type = card.type
    };
    if (card.subType) {
      requestCard.subType = card.subType
    };
    if (card.set) {
      requestCard.set = card.set
    };
    // this is broken. can only search by name, which is fine, but need to be able to search by color, cost, type, subtype, set. Need to fix the object
    $http({
      method: 'GET',
      url: ('https://api.magicthegathering.io/v1/cards?name=' + requestCard.name + '&subtypes=')
    })
    .then(function(response){
      cards = response.data.cards;
      for (var i = 0; i < cards.length; i++) {
        if (!cards[i].imageUrl) {
          cards[i].imageUrl = '../images/MTG-BackOfCard.jpg';
        }
      }
      console.log(cards);
      $scope.cards = cards;
    });

  };

  $scope.addToDeck= function (card) {
    console.log(card);
    $http.post('/deck',card)
    .then(function(response){
      console.log(response)
    })
    .then(
      $location.path('/deck')
    )
  };


}])

myApp.controller('deckController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    var refresh = function (){
      $http.get('/deck').then(function(response) {
        $scope.deck = response.data;
        // $scope.card = null;
    })}

    refresh();

    $scope.increaseQuantity = function (id) {
      $http.get('/deck/' + id)
      .then(function(response){
        let editCard = response.data;
        if (!editCard.quantity) {
          editCard.quantity = ['card', 'card']
        }
        else if(editCard.quantity.length < 4){
          editCard.quantity.push('card');
        }
        console.log(editCard);
        $http.put('/deck/' + editCard._id, editCard)
        .then($location.path('/deck'));
      })

    };

    $scope.decreaseQuantity = function (id) {
      $http.get('/deck/' + id)
      .then(function(response){
        let editCard = response.data;
        if (!editCard.quantity | editCard.quantity.length <= 1) {
          console.log(editCard);
          $http.delete('/deck/' + id)
          .then(refresh());
        }
        else {
          editCard.quantity.pop();
          console.log(editCard);
          $http.put('/deck/' + editCard._id, editCard)
          .then(refresh());
        }

      })

    };
    //
    // $scope.addCard = function(){
    //   let cardToAdd = $scope.card
    //   console.log(cardToAdd);
    //   $http.post('/deck',cardToAdd).then(function(response){
    //     console.log(response);
    //     refresh();
    //   })
    // }
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

    $scope.goToFinder = function(){
      $location.path('/finder')
    }
}]);
