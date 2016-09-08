(function() {
  'use strict';

  angular
    .module('fruitWorld')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
