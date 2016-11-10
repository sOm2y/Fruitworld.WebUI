(function() {
  'use strict';

  angular
    .module('fruitWorld')
    .config(routerConfig);
  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('dashboard', {
        url: "/dashboard",
        templateUrl: "app/dashboard/dashboard.html",
        controller: 'dashboardCtrl',
        data: {
           requireLogin: true
        }
      })
      .state('orders', {
        url: "/orders",
        templateUrl: "app/orders/orders.html",
        controller: 'orderCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('purchase', {
        url: "/purchase",
        templateUrl: "app/purchase/purchase.html",
        controller: 'purchaseCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('products', {
        url: "/products",
        templateUrl: "app/products/products.html",
        controller: 'productCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('products.details', {
        url: "/details",
        views: {
          "products-details-view": {
            templateUrl: "app/products/productsDetails.html",
            controller: 'productDetailsCtrl'
          }
        },
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('branch', {
        url: "/branch",
        templateUrl: "app/branch/branch.html",
        controller: 'branchCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('boxes', {
        url: "/boxes",
        templateUrl: "app/box/boxes.html",
        controller: 'boxCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('boxes.details', {
        url: "/details",
        views: {
          "box-details-view": {
            templateUrl: "app/box/boxDetails.html",
            controller: 'boxDetailsCtrl'
          }
        },
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('parcel', {
        url: "/parcel",
        templateUrl: "app/parcel/parcel.html",
        controller: 'parcelCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('productStock', {
        url: "/productStock",
        templateUrl: "app/stocks/productstock.html",
        controller: 'stocksCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('boxStock', {
        url: "/boxStock",
        templateUrl: "app/stocks/boxstock.html",
        controller: 'stocksCtrl',
        data: {
          pageTitle: 'Example view'
        }
      })
      .state('shoppingCart', {
        url: "/cart",
        templateUrl: "app/shoppingCart/shoppingCart.html",
        controller: 'shoppingCartCtrl',
        data: {
          pageTitle: 'Example view'
        }
      });

    $urlRouterProvider.otherwise('/dashboard');
  }

})();
