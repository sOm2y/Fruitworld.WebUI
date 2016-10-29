(function() {
  'use strict ';
  angular.module('app.services', [])
    .factory('fruitWorldAPIService', ['$resource', '$http', function($resource, $http) {
      var apiUrl = 'http://webapi20160908115938.azurewebsites.net/api/';
      return $resource(apiUrl + ':section/:id', {
        id: '@_id'
      }, {
        'update': {
          method: 'PUT'
        }
      });
      //   DEFAULT RESOURCE FUNTIONS
      //   'get':    {method:'GET'},
      //   'save':   {method:'POST'},
      //   'query':  {method:'GET', isArray:true},
      //   'remove': {method:'DELETE'},
      //   'delete': {method:'DELETE'}
    }])
    .service('fruitWorldCRUDService', ['fruitWorldAPIService',
      function(fruitWorldAPIService) {
        this.get = function(functionName, $scope) {
          // $activityIndicator.startAnimating();
          return fruitWorldAPIService.query({
              section: functionName
            })
            .$promise.then(function(itemList) {
              //set list data or create first item
              if (_.size(itemList)) {
                $scope.itemList = itemList;
                // $scope.employeePagination();
              } else {
                $scope.itemList = [];
                $scope.createItem();
              }
            }, $scope.handleErrors).finally(function() {
              // $rootScope.isLoading = false;
            });
        };

        this.update = function(functionName, $scope, item) {
          // $activityIndicator.startAnimating();
          return fruitWorldAPIService.save({
              section: functionName
            }, item)
            .$promise.then(function(item) {
              if ($scope.itemList) {
                $scope.itemList.push(item);
              }
              if ($scope.newItem) {
                var updateObject = {};
                updateObject[functionName] = $scope.itemList.length;
              }
              resetToList($scope);
              $scope.addAlert({
                type: 'success',
                message: "businessSetup:save-success",
                name: item.name ? item.name : findName(item)
              });
              $scope.$broadcast('updateSuccess');
              return item;
            }, $scope.handleErrors).finally(function() {
              // $activityIndicator.stopAnimating();
            });
        };

        this.cancelEdit = function($scope) {
          if (!$scope.newItem) {
            $scope.itemList.push($scope.itemCopy);
          }
          resetToList($scope);
        };
        this.validateForm = function($scope) {
          var valid = $scope.itemForm.$valid;

          if (!valid) {
            var errorTypes = $scope.itemForm.$error;
            _.forEach(errorTypes, function(errorType, key) {
              _.forEach(errorType, function(error) {
                var errorMessage = error && error.$name ? error.$name : key;
                $scope.addAlert({
                  type: 'warning',
                  message: 'businessSetup:' + errorMessage + '-invalid'
                });
              });
            });
          }
          return valid;
        };

        var resetToList = function($scope) {
          $scope.item = null;
          // $scope.itemForm.$setPristine();
          // $scope.itemForm.$setUntouched();
          // $scope.removeAlerts();
          $scope.newItem = null;
          $scope.itemCopy = null;
        };

        var findName = function(item) {
          if (item.firstName && item.lastName) {
            return item.firstName + " " + item.lastName;
          } else if (item.business) {
            return item.business.name;
          }
        };
      }
    ])
    .service('shoppingCartService', ['$rootScope', function($rootScope) {
      this.addProduct = function(product) {
        var shoppingCart = [];
        shoppingCart.push(product);
        this.updateShoppingCart(shoppingCart);
      };

      this.updateShoppingCart = function(newShoppingCart) {
        if (localStorage.getItem('shoppingCart')) {
          var oldShoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
          _.forEach(newShoppingCart, function(newProduct) {
            oldShoppingCart.push(newProduct);
          });
          localStorage.setItem('shoppingCart', JSON.stringify(oldShoppingCart));
        } else {
          localStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart));
        }
      };

      this.getShoppingCart = function() {
        if (localStorage.getItem('shoppingCart')) {
          return JSON.parse(localStorage.getItem('shoppingCart'));
        } else {
          //error handling should be triggered.
          return [];
        }
      };

      this.countDuplicateProducts = function(productsInCart) {
        var result = _(productsInCart)
          .groupBy('productId')
          .map(function(products, productId) {
            return {
              productId: productId,
              product:products[0],
              count: products.length
            };
          }).value();
          return result;
      };

      this.getTotalPrice = function(productsInCart){
        $rootScope.totalPrice = 0;
        return  _.map(productsInCart,function(product){
           return $rootScope.totalPrice =$rootScope.totalPrice + product.product.listPrice*product.count;
        });
      };

      this.removeProduct = function(deleteProduct,productsInCart){
        var newShoppingCart = _.remove(productsInCart, function(product) {
          return product.productId !== deleteProduct.product.productId;
        });
        localStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart));
        return newShoppingCart;
      };

    }]);

})();
