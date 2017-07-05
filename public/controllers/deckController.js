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
  .when('/decklist', {
    templateUrl: 'views/deckList.html',
    controller: 'deckListController'
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'deckLoginController'
  })
  .when('/newdeck', {
    templateUrl: 'views/newDeck.html'
  })
  .otherwise({
    redirectTo: '/deck'
  })

}])

myApp.controller('deckLoginController',['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.addUser = function(user) {
    let newUser = {
      username: user.username,
      password: user.password,
      decks: []
    }
    $http.post('/deck',newUser)
    .then(function(response){
      console.log(response)
    })
    .then(
      $location.path('/decklist')
    )
  }



}])

myApp.controller('deckListController',['$scope', '$http', '$location', function($scope, $http, $location){
  refresh = function(){
    $http.get('/deck')
    .then(function(response){
      console.log(response.data);
    })
  }

  refresh();

  $scope.addDeck = function(newDeck) {
    let blankDeck = {
      name: $scope.newDeck.name,
      mechanics: [],
      cards: []
    }
    $http.get('/deck')
    .then(function(response){
      let res = response.data;
      res[0].decks.push(blankDeck);
      console.log(res);
      $http.put('/deck/' + res._id, res);
    })
    // console.log(newDeck);
  }

}])
// $http.put('/deck/' + editCard._id, editCard)
// .then(refresh());



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
      // 'name': null,
      // 'color': null,
      // 'cmc': null,
      // 'type': null,
      // 'subType': null,
      // 'set': null
    };
    if (card.name) {
      requestCard.name = card.name
    }
    else {
      requestCard.name = '';
    }
    if (card.color) {
      requestCard.color = card.color
    }
    else {
      requestCard.color = '';
    }
    if (card.cost) {
      requestCard.cmc = card.cost
    }
    else {
      requestCard.cmc = '';
    }
    if (card.type) {
      requestCard.type = card.type
    }
    else {
      requestCard.type = '';
    }
    if (card.subType) {
      requestCard.subType = card.subType
    }
    else {
      requestCard.subType = '';
    }
    if (card.set) {
      requestCard.set = card.set
    }
    else {
      requestCard.set = '';
    }
    // this is broken. can only search by name, which is fine, but need to be able to search by color, cost, type, subtype, set. Need to fix the object
    $http({
      method: 'GET',
      url: ('https://api.magicthegathering.io/v1/cards?name=' + requestCard.name + '&colors=' + requestCard.color + '&cmc=' + requestCard.cmc + '&types' + requestCard.type + '&subtypes=' + requestCard.subType + '&set=' + requestCard.set)
    })
    .then(function(response){
      cards = response.data.cards;
      for (var i = 0; i < cards.length; i++) {
        if (!cards[i].imageUrl) {
          cards[i].imageUrl = '../images/MTG-BackOfCard.jpg';
        }
        if (!cards[i].rulings) {
          cards[i].rulings = [{text: "No rulings found for this card."}];
        }
        cards[i].quantity = 1;
        cards[i].mechanics = [];
      }
      console.log(cards);
      $scope.cards = cards;
    });

  };

  $scope.addToDeck= function (card) {
    console.log(card);
    $http.post('/deck', card)
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

        let deckBack = response.data;
        console.log(deckBack);

        // for (var i = 0; i < deckBack.length; i++) {
        //   if (deckBack[i].manaCost.includes('{B}')) {
        //     console.log(deckBack[i].name + " has black");
        //     // deckBack[i].manaCost = '<img src="/images/swamp.png" alt="magicCard"/>'
        //   }
        //   if (deckBack[i].manaCost.includes('{U}')) {
        //     console.log(deckBack[i].name + " has blue");
        //   }
        //   if (deckBack[i].manaCost.includes('{G}')) {
        //     console.log(deckBack[i].name + " has green");
        //   }
        //   if (deckBack[i].manaCost.includes('{W}')) {
        //     console.log(deckBack[i].name + " has white");
        //   }
        //   if (deckBack[i].manaCost.includes('{R}')) {
        //     console.log(deckBack[i].name + " has red");
        //   }
        // }

        $scope.deck = deckBack;
    })};

    refresh();

    $scope.increaseQuantity = function (id) {
      $http.get('/deck/' + id)
      .then(function(response){
        let editCard = response.data;
        if (editCard.quantity < 4) {
          editCard.quantity++;
        }

        $http.put('/deck/' + editCard._id, editCard)
        .then(refresh());
      })

    };

    $scope.decreaseQuantity = function (id) {
      $http.get('/deck/' + id)
      .then(function(response){
        let editCard = response.data;
        if (editCard.quantity <= 1) {
          console.log(editCard);
          $http.delete('/deck/' + id)
          .then(refresh());
        }
        else {
          editCard.quantity--;
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
