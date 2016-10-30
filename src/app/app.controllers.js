(function(){
  'use strict';

  angular.module('fruitWorld')
    .controller('appCtrl', ['$rootScope','$scope','shoppingCartService',function ($rootScope,$scope,shoppingCartService) {
      //watch shopping cart
      $scope.$watch(function () {
        return localStorage.getItem('countedShoppingCart');
      },function(newVal,oldVal){
        if(localStorage.getItem('countedShoppingCart')){
          $scope.countedProducts = shoppingCartService.getShoppingCart();
          shoppingCartService.getTotalPrice($scope.countedProducts);
        }
      }, true);
      // applySavedShoppingCart();
      //
      // $rootScope.$on('broadcastShoppingCart', function (event, data) {
      //   applySavedShoppingCart();
      // });
      //
      // function applySavedShoppingCart(){
      //   if(localStorage.getItem('shoppingCart')){
      //     $scope.selectedProducts = JSON.parse(localStorage.getItem('shoppingCart'));
      //     $scope.countedProducts = shoppingCartService.countDuplicateProducts($scope.selectedProducts);
      //     $scope.totalProducts = _.sumBy($scope.countedProducts , function(product) { return product.count; });
      //   }
      // }

    }]);
})();
