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
        controller: 'dashboardCtrl'
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
            controller: 'productDetailsCtrl',
          }
        },
        data: {
          pageTitle: 'Example view'
        }
      });

    $urlRouterProvider.otherwise('/dashboard');
  }

})();
