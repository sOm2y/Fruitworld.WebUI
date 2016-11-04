(function () {

  angular.module('fruitWorld.tokenService')
    .constant('appSettings',
      {
        //TODO update the urls
        backendUri: 'http://localhost:55462/',
        accountServerUri: 'http://localhost:55462/',
        appUri: 'http://localhost:3000/'
      });


})();
