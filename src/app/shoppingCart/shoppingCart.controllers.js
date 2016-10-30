(function() {
  'use strict';
  angular.module('fruitWorld')
    .controller('shoppingCartCtrl', ['$rootScope', '$scope', 'shoppingCartService', function($rootScope, $scope, shoppingCartService) {
      $scope.hasShoppingCartChanged = false;
      $scope.countedShoppingCart = shoppingCartService.getShoppingCart();
      $scope.sum = shoppingCartService.getTotalPrice($scope.countedShoppingCart);
      $scope.addToBox = function(products) {
        //TODO
      };
      $scope.notf1Options = {
        templates: [{
          type: "ngTemplate",
          template: $("#notificationTemplate").html()
        }]
      };
      $scope.updateProductCount = function(index, updatedProduct) {
        $scope.countedShoppingCart[index].count = updatedProduct.count;
        shoppingCartService.getTotalPrice($scope.countedShoppingCart);
        $scope.hasShoppingCartChanged = true;
      };
      $scope.updateShoppingCart = function() {
        localStorage.setItem('countedShoppingCart', JSON.stringify($scope.countedShoppingCart));
        $scope.notf1.show({
          kValue: "Shopping Cart has been updated !"
        }, "ngTemplate");

      };
      $scope.deleteCartProduct = function(deleteProduct) {
        $scope.countedShoppingCart = shoppingCartService.removeProduct(deleteProduct, $scope.countedShoppingCart);
        shoppingCartService.getTotalPrice($scope.countedShoppingCart);
      };

    }]);
})();
