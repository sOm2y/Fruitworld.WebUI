(function(){
  'use strict';
  angular.module('fruitWorld')
    .controller('shoppingCartCtrl', ['$scope','shoppingCartService',function ($scope,shoppingCartService) {
      $scope.cartProducts = shoppingCartService.getShoppingCart();
      $scope.countedShoppingCart = shoppingCartService.countDuplicateProducts($scope.cartProducts);
      $scope.addToBox = function(products){
        //TODO
      };
    }]);
})();
