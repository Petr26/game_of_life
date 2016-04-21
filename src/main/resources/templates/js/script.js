var TODOApp = angular.module('TODOApp', ['TODOAppControllers']);

TODOApp.constant("apiURL", "backend/backend.php");

TODOApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
}]);

TODOApp.run(['$rootScope', function($rootScope) {
	$rootScope.currentTask = null;
	$rootScope.tasks = [];
}]);

//------------------------------------------------------------------------------

var TODOAppControllers = angular.module('TODOAppControllers', []);

TODOAppControllers.controller("TasksCtrl", ["$http", "$rootScope", "$scope", "apiURL", function($http, $rootScope, $scope, apiURL) {
	console.log("TasksCtrl");
  
  $scope.pozdrav = "Hello Tam kam je ptaci mohou!";
  $http.get(apiURL).success(function(data) {
     if(data.success) {
      	$rootScope.tasks = data.tasks; 
     }
  });
  
  $scope.showTask = function(t) {
    var ct = $rootScope.currentTask;
    if (ct && ct.id == t.id) {                    // odznacuju oznaceny ukol
      $rootScope.currentTask = null;
    } else {                                      // oznacuju ukol
      $rootScope.currentTask = t;
    }
  };
  
  $scope.deleteTask = function(t) {
    var param = "delete_id=" + t.id;
    $http.post(apiURL, param).success(function(data) {
      if(data.success) {
        var i = $rootScope.tasks.indexOf(t);
        if(i != -1) {
          $rootScope.tasks.splice(i, 1);  // splices
        }
      }
    });
  };

}]);

TODOAppControllers.controller("NewTaskCtrl", ["$http", "$rootScope", "$scope", "apiURL", function($http, $rootScope, $scope, apiURL) {
	console.log("NewTaskCtrl");
  $scope.tile = "";
  $scope.description = "";
  
  $scope.addTask = function() {
    console.log("SPUSTILA SA KONSOLA");
    
    if($scope.title) {
    var param = "title=" + $scope.title + "&description=" + $scope.description; //& je rozdeleni 
    
      $http.post(apiURL, param).success(function(data) {
         if(data.success) {
            $rootScope.tasks.push(data.task);
         }
      });
    } else {
      alert("Zadej nazev ukol.");
    }
  };
}]);

TODOAppControllers.controller("TaskEditCtrl", ["$http", "$rootScope", "$scope", "apiURL", function($http, $rootScope, $scope, apiURL) {
	console.log("TaskEditCtrl");
    $scope.updateTask = function() {
      var ct = $rootScope.currentTask;
      if(ct.title) {
        var param = "update_id=" + ct.id
                    + "&title=" + ct.title
                    + "&description=" + ct.description
                    + "&complete=" + (ct.complete ? "1" : "0");
        console.log("VYPISU " + param);           
        $http.post(apiURL, param).success(function(data) {
          if (!data.success) {
            alert("BYCHASA UKALDANI ");
          }
        });
      } else {
        alert("zadej nazev ukolu");
      }
    };
}]);