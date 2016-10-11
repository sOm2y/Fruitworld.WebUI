(function(){
  'use strict';

  angular.module('fruitWorld')
    .controller('appCtrl', ['$scope',function ($scope) {
      $scope.$watch(function () {
        return localStorage.getItem('shoppingCart');
      },function(newVal,oldVal){
        if(localStorage.getItem('shoppingCart')){
          $scope.selectedProducts = JSON.parse(localStorage.getItem('shoppingCart'));
        }
      })
    }]);
})();
