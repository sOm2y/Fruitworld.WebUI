(function () {

  angular.module('fruitWorld.tokenService')
    .factory('TokenManager', [
      'appSettings',
      TokenManager]);

  function TokenManager(appSettings) {

    var config = {
      client_id: 'fruitWorld.app',
      redirect_uri: appSettings.appUri + 'callback.html',
      response_type: 'id_token token',
      authority: appSettings.accountServerUri
    };

    var mgr = new OidcTokenManager(config);

    return {
      getTokenManager: function () {
        return mgr;
      }
    };
  }

})();
