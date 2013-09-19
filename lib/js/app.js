Parse.initialize("72pGg2ZiWnLDprPZiOi8IruKqI1fXPWpVqZaCcnY", "8DsPyjA4GQuXz21sEkqgBQSTpOyXZnVFetne594m");

//
// routing
//




var app = angular.module('denverbrewsView', []);

app.config(function($routeProvider) {
	$routeProvider.when("/", 
	{
		templateUrl: 'lib/partials/home.html',
		controller: "HomeCntl"
	});
	$routeProvider.when('/brews/', {
		templateUrl: 'lib/partials/brews-list.html',
		controller: "BrewsCntl"
	});
	$routeProvider.when('/brews/:brewId', {
		templateUrl: 'lib/partials/brew-detail.html',
		controller: "BrewDetailsCtrl"

	});
	$routeProvider.when('/submit', {
		templateUrl: 'lib/partials/submit.html',
		controller: "submitNewBeer"
	});

	}
);

//
// Controllers
//

app.controller("MainCntl", function($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
});

app.controller("HomeCntl", function($scope, $routeParams){
	$scope.name = "HomeCntl";
	$scope.params = $routeParams;
});

app.controller("BrewsCntl", function($scope, $routeParams){
	$scope.name = "BrewsCntl";
	$scope.params = $routeParams;
	$scope.brews = []
	
	var Brews = Parse.Object.extend("Brews");
	var query = new Parse.Query(Brews);
	query.notEqualTo("beerName", " ");

	query.find({
		success: function(results) {
			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++) { 
				var object = results[i];
				var newBeer = {};
				newBeer.beerName = object.get("beerName"); // name
				newBeer.brewersName = object.get("brewersName"); // brewery
				newBeer.brewersLocation = object.get("brewersLocation"); // location
				newBeer.brewSnippet = object.get("brewSnippet"); // snippit
				newBeer.beerImg = object.get("beerImg"); // img
				newBeer.submitterName = object.get("submitterName"); // reviewer
				// console.log(newBeer);
				$scope.$apply($scope.brews.push(newBeer));
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

});

app.controller("submitNewBeer", function($scope){
	
	$scope.submitNewBeer = function (event) {
		if($scope.password === "BeerMe"){
			var newBeer = {}
			newBeer.beerName = $scope.beerName; // name
			newBeer.brewersName = $scope.brewersName; // brewery
			newBeer.beerImg = $scope.beerImg; // img
			newBeer.brewersLocation = $scope.brewersLocation; // location
			newBeer.brewSnippet = $scope.brewSnippet; // snippit
			newBeer.submitterName = $scope.submitterName; // reviewer
			
			var Brews = Parse.Object.extend("Brews");
			var beerObject = new Brews();
			beerObject.save(newBeer, {
				success: function(object) {
					alert("Thanks friend! we uploaded " + newBeer.beerName);

				}
			});
		}else{
			alert("enter the right password!")
		}

	}

	$scope.showMeBeers = function(event){
		console.log("test")
		var Brews = Parse.Object.extend("Brews");
		var query = new Parse.Query(Brews);
		// query.notEqualTo("beerName", " ");
		query.find({
			success: function(results) {
				alert("Successfully retrieved " + results.length + " beers.");
				// Do something with the returned Parse.Object values
				for (var i = 0; i < results.length; i++) { 
					var object = results[i];
					var newBeer = {};
					newBeer.beerName = object.get("beerName"); // name
					newBeer.brewersName = object.get("brewersName"); // brewery
					newBeer.beerImg = object.get("beerImg"); // img
					newBeer.brewersLocation = object.get("brewersLocation"); // location
					newBeer.submitterEmail = object.get("submitterEmail"); // snippit
					newBeer.submitterName = object.get("submitterName"); // reviewer
					console.log(newBeer);
				}
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});

	}

});



app.controller("BrewDetailsCtrl", function($scope, $routeParams, $http){
	$scope.name = "BrewDetailsCtrl";
	$scope.params = $routeParams;
	$http.get('lib/brews/' + $routeParams.brewId + '/data.json').success(function(data) {
		$scope.brew = data;
	});
	

});

