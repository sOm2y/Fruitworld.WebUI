(function(){
  'use strict';
  angular.module('fruitWorld')
    .controller('shoppingCartCtrl', ['$scope','shoppingCartService',function ($scope,shoppingCartService) {

      $scope.cartProducts = shoppingCartService.getShoppingCart();
      $scope.countedShoppingCart = shoppingCartService.countDuplicateProducts($scope.cartProducts);


      $scope.sum = shoppingCartService.getTotalPrice($scope.countedShoppingCart);
      $scope.addToBox = function(products){
        //TODO
      };
      $scope.updateProductCount = function(index,updatedProduct){
        $scope.countedShoppingCart[index].count=updatedProduct.count;
        shoppingCartService.getTotalPrice($scope.countedShoppingCart);
      };
      $scope.deleteCartProduct = function(deleteProduct){
        $scope.cartProducts = shoppingCartService.removeProduct(deleteProduct,$scope.cartProducts);
        $scope.countedShoppingCart = shoppingCartService.countDuplicateProducts($scope.cartProducts);
        shoppingCartService.getTotalPrice($scope.countedShoppingCart);
      }

    }]);
})();
