(function() {
  'use strict';

  angular
    .module('fruitWorld')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope) {
		$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
		    $rootScope.previousState = from.name;
		    $rootScope.currentState = to.name;
		    console.log('Previous state:'+$rootScope.previousState);
		    console.log('Current state:'+$rootScope.currentState);
		});

    $log.debug('runBlock end');
  }

})();
