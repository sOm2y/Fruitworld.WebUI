(function() {
  'use strict';

  angular.module('fruitWorld')
    .controller('appCtrl', ['$rootScope', '$scope', 'shoppingCartService', '$http', 'loginModal', function($rootScope, $scope, shoppingCartService, $http, loginModal) {
      //watch shopping cart
      $scope.$watch(function() {
        return localStorage.getItem('countedShoppingCart');
      }, function(newVal, oldVal) {
        if (localStorage.getItem('countedShoppingCart')) {
          $scope.countedProducts = shoppingCartService.getShoppingCart();
          shoppingCartService.getTotalPrice($scope.countedProducts);
        }
      }, true);

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        // $rootScope.isLoading = true;
        var requireLogin = toState.data.requireLogin;
        $rootScope.buttonDisable = false;
        if (localStorage.getItem('oauth_token')) {
          var user = localStorage.getItem('oauth_token');
          $rootScope.setUserAuth(user);
          //  getUserProfile();
        } else {
          if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            $rootScope.isLoading = false;
            loginModal()
              .then(function() {
                //  getUserProfile();
                return $state.go('car');
              })
              .catch(function() {
                //TODO: error handling
              });
          }
        }
      });
      $rootScope.setUserAuth = function(oauth) {
        var authHeader = 'Bearer ' + oauth.access_token;
        $http.defaults.headers.common.Authorization = authHeader;
      };
      $rootScope.logout = function() {
        localStorage.clear();
        delete $rootScope.currentUser;
        loginModal().then(function() {
          return $state.go($state.current, {}, {
            reload: true
          });
        });
      };
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


    }])
    .controller('LoginModalCtrl', ['$rootScope', '$scope', 'loginModal', 'fruitWorldAPIService', '$state','uibModalInstance',
      function($rootScope, $scope, loginModal, fruitWorldAPIService, $state,uibModalInstance) {
        $rootScope.close = function(user) {
          $uibModalInstance.close(user);
        };

        $scope.attemptLogin = function(email, passWord) {
          var data = "userName=" + email + "&password=" + passWord + "&grant_type=password";
          //  $http.defaults.headers.post['Content-Type'] =  'application/x-www-form-urlencoded';
          fruitWorldAPIService.save({
            section: 'token'
          }, data).$promise.then(function(res) {
            $rootScope.setUserAuth(res);

            if ($scope.rememberPassword) {
              localStorage.setItem('oauth_token', res);
            }

            var user = {
              'email': email,
              'password': passWord
            };
            $rootScope.close(user);
          }, function(error) {
            // $mdToast.show({
            //   template: '<md-toast class="md-toast md-toast-500"><span flex>' + 'Login Failed' + '</span></md-toast>',
            //   position: 'top right',
            //   hideDelay: 5000
            // });
          });

        };

      }
    ]);
})();
