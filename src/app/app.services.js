(function() {
  'use strict ';
  angular.module('fruitWorld.services', [])
    .factory('fruitWorldAPIService', ['$resource', '$http', function($resource, $http) {
      // var apiUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var apiUrl = "http://localhost:64328/api/";
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
      this.addProduct = function(newProduct) {
        if (localStorage.getItem('countedShoppingCart')) {
          var oldShoppingCart = JSON.parse(localStorage.getItem('countedShoppingCart'));
          updateProductIndex = _.findIndex(oldShoppingCart, function(oldProduct) { return oldProduct.productId === newProduct.productId; });
          if(updateProductIndex !== -1){
            oldShoppingCart[updateProductIndex].product.push(newProduct);
            oldShoppingCart[updateProductIndex].count++;
          }else{
            var newProducts = [];
            newProducts.push(newProduct);
            oldShoppingCart.push({
              productId:newProduct.productId,
              product:newProducts,
              count:newProducts.length
            })
          }
          localStorage.setItem('countedShoppingCart', JSON.stringify(oldShoppingCart));
        } else {
          var newShoppingCart = [];
          newShoppingCart.push(newProduct);
          localStorage.setItem('countedShoppingCart', JSON.stringify(this.countDuplicateProducts(newShoppingCart)));
        }
      };

      this.updateShoppingCart = function(newProduct) {
        // if (localStorage.getItem('shoppingCart')) {
        //   var oldShoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
        //   _.forEach(newShoppingCart, function(newProduct) {
        //     oldShoppingCart.push(newProduct);
        //   });

      };

      this.getShoppingCart = function() {
        if (localStorage.getItem('countedShoppingCart')) {
          return JSON.parse(localStorage.getItem('countedShoppingCart'));
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
              product: products,
              count: products.length
            };
          }).value();
        return result;
      };

      this.getTotalPrice = function(productsInCart) {
        $rootScope.totalPrice = 0;
        $rootScope.totalCount = 0;
        return _.each(productsInCart, function(product) {
          $rootScope.totalPrice = $rootScope.totalPrice + product.product[0].listPrice * product.count;
          $rootScope.totalCount = $rootScope.totalCount + parseInt(product.count);
          // console.log("total count "+ $rootScope.totalCount+"product count "+product.count);
        });
      };

      this.removeProduct = function(deleteProduct, productsInCart) {
        var newShoppingCart = _.remove(productsInCart, function(product) {
          return product.productId !== deleteProduct.productId;
        });
        localStorage.setItem('countedShoppingCart', JSON.stringify(newShoppingCart));
        return newShoppingCart;
      };

    }]);

})();
