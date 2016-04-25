var GameOfLife = angular.module('GameOfLife', ['Controllers']);

GameOfLife.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
}]);

GameOfLife.run(['$rootScope', function($rootScope) {
}]);

//------------------------------------------------------------------------------

var Controllers = angular.module('Controllers', []);

Controllers.controller("GameOfLife", ["$http", "$rootScope", "$scope", "$interval", function($http, $rootScope, $scope, $interval) {
  $scope.height = 20;
  $scope.width = 30;
  $scope.runnerInterval = 100;

  $scope.newGame = function (pattern) {
    $scope.history = [];

    switch(pattern) {
      case 1:
        $scope.board = init($scope.height, $scope.width);
        break;
      case 2:
        $scope.board = pattern1();
        break;
      default:
        $scope.board = init($scope.height, $scope.width);
    }
  };

  $scope.updateGame = function(pattern) {
    $scope.newGame(pattern);
  };

  $scope.next = function () {
    $scope.history.push($scope.board);
    $scope.board = computeNext($scope.board);
  };

  $scope.cellClass = function (row, cell) {
    if (remove($scope.board, row, cell)) {
      return "die";
    }
    if (newLife($scope.board, row, cell)) {
      return "new";
    }
    return "";
  };

  $scope.step = function (index) {
    $scope.board = $scope.history[index];
    $scope.history = $scope.history.slice(0, index);
  };

  $scope.toggle = function (row, cell) {
    $scope.history = []; // Reset history as it is no longer accurate
    $scope.board[row][cell] = !$scope.board[row][cell];
  };

  $scope.newGame(1);

  function init(height, width) {

    var board = [];
    for (var h = 0 ; h < height ; h++) {
      var row = [];
      for (var w = 0 ; w < width ; w++) {
        row.push(false);
      }
      board.push(row);
    }
    return board;
  }

  $scope.runIt = function () {
    if ($scope.runner) {
      $interval.cancel($scope.runner);
    }

    $scope.runner = $interval(function () {
      $scope.next();
      }, $scope.runnerInterval);
  };

  $scope.stopIt = function () {
    $interval.cancel($scope.runner);
  };

  function pattern1() { 
	$scope.height = 19;
	$scope.width = 54;
    var board = init($scope.height, $scope.width);

    board[1][1] = (true);
    board[1][2] = (true);
    board[2][2] = (true);
    board[3][2] = (true);
    board[4][3] = (true);
    board[4][4] = (true);
    board[3][4] = (true);
    
    board[17][1] = (true);
    board[17][2] = (true);
    board[16][2] = (true);
    board[15][2] = (true);
    board[14][3] = (true);
    board[14][4] = (true);
    board[15][4] = (true);
    
    board[1][52] = (true);
    board[1][51] = (true);
    board[2][51] = (true);
    board[3][51] = (true);
    board[4][50] = (true);
    board[4][49] = (true);
    board[3][49] = (true);
    
    board[17][52] = (true);
    board[17][51] = (true);
    board[16][51] = (true);
    board[15][51] = (true);
    board[14][50] = (true);
    board[14][49] = (true);
    board[15][49] = (true);
    
    board[15][26] = (true);
    board[15][27] = (true);
    board[14][27] = (true);
    board[14][26] = (true);
    
    board[3][26] = (true);
    board[3][27] = (true);
    board[4][27] = (true);
    board[4][26] = (true);
    
    board[5][12] = (true);
    board[6][12] = (true);
    board[7][12] = (true);
    board[11][12] = (true);
    board[12][12] = (true);
    board[13][12] = (true);
    board[5][13] = (true);
    board[8][13] = (true);
    board[10][13] = (true);
    board[13][13] = (true);
    board[5][14] = (true);
    board[13][14] = (true);
    board[6][16] = (true);
    board[12][16] = (true);
    board[7][17] = (true);
    board[8][17] = (true);
    board[10][17] = (true);
    board[11][17] = (true);
    
    board[7][36] = (true);
    board[7][37] = (true);
    
    board[11][36] = (true);
    board[11][37] = (true);
    
    board[7][40] = (true);
    board[7][41] = (true);
    board[6][41] = (true);
    board[5][41] = (true);
    board[6][42] = (true);
    board[5][40] = (true);
    board[4][40] = (true);
    
    board[11][40] = (true);
    board[11][41] = (true);
    board[12][41] = (true);
    board[13][41] = (true);
    board[12][42] = (true);
    board[13][40] = (true);
    board[14][40] = (true);
    
    return board;
  }

  function computeNext(board) {
    var newBoard = [];
    for (var r = 0 ; r < board.length ; r++) {
      var newRow = [];
      for (var c = 0 ; c < board[r].length ; c++) {
        newRow.push(remain(board, r, c) || newLife(board, r, c));
      }
      newBoard.push(newRow);
    }
    return newBoard;
  }

  function remain(board, row, cell) {
    return valueAt(board, row, cell)
        && countNeighbours(board, row, cell) >= 2
        && countNeighbours(board, row, cell) <= 3;
  }
  function remove(board, row, cell) {
    return valueAt(board, row, cell)
        && (countNeighbours(board, row, cell) < 2
        || countNeighbours(board, row, cell) > 3);
  }
  function newLife(board, row, cell) {
    return !valueAt(board, row, cell)
        && countNeighbours(board, row, cell) == 3;
  }

  function countNeighbours(board, row, cell) {
    var n = 0;
    n += valueAt(board, row-1, cell-1) ? 1 : 0;
    n += valueAt(board, row-1, cell+0) ? 1 : 0;
    n += valueAt(board, row-1, cell+1) ? 1 : 0;
    n += valueAt(board, row+0, cell-1) ? 1 : 0;
    n += valueAt(board, row+0, cell+1) ? 1 : 0;
    n += valueAt(board, row+1, cell-1) ? 1 : 0;
    n += valueAt(board, row+1, cell+0) ? 1 : 0;
    n += valueAt(board, row+1, cell+1) ? 1 : 0;
    return n;
  }

  function valueAt(board, row, cell) {
    return (row >= 0 && row < board.length && cell >= 0  && cell < board[row].length && board[row][cell]);
  }

}]);
