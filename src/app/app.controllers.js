(function () {
  'use strict';

  angular.module('fruitWorld')
    .controller('appCtrl', [
      '$scope',
      'tokenManger',
      function ($scope,
                tokenManager) {

        //is this the main controller?
        var mgr = tokenManager.getTokenManager();
        if (mgr.expired) {
          // TODO: uncomment this for authentication
          //mgr.redirectForToken();
        }

        $scope.message = '';


      }]);
})();
