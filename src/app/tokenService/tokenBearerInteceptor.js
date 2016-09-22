(function () {

  angular.module('fruitWorld.tokenService')
    .factory('TokenBearerInterceptor', [
      'appSettings',
      'TokenManager',
      TokenBearerInterceptor]);

  function TokenBearerInterceptor(appSettings,
                                  tokenManager) {

    var inteceptor = {
      request: function (config) {
        if (config.url.indexOf(appSettings.backendUri) === 0) {
          if (tokenManager.getTokenManager().expired) {
            tokenManager.getTokenManager().redirectForToken();
          } else {
            config.headers.Authorization = 'Bearer ' +
              tokenManager.getTokenManager().access_token;
          }
        }
        return config;
      }
    };

    return inteceptor;
  }


})();
