var app = angular.module('myApp', []);


app.controller('mainCtrl', function($scope, $http) {

	$scope.emailRegex =  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	$scope.password = "";
	$scope.email = "";

	$scope.testfunction= function(){
		console.log($scope.email);
	}


	$scope.submitForm = function(isValid) {

		
	};


});
