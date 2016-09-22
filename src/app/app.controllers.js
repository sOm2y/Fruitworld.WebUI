(function () {
  'use strict';

  angular.module('fruitWorld')
    .controller('appCtrl', [
      '$scope',
      '$log',
      'tokenManger',
      function ($scope,
                $log,
                tokenManager) {

        //is this the main controller?
        $log.debug('token manager initializing.');
        var mgr = tokenManager.getTokenManager();
        if (mgr.expired) {
          $log.debug('token expired, redirecting for new token.')
          // TODO: uncomment this for authentication
          //mgr.redirectForToken();
        }

        $scope.message = '';


      }]);
})();
