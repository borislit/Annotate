'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainCtrl = function MainCtrl(MessagingService) {
    _classCallCheck(this, MainCtrl);

    MessagingService.sendMessage();
  };

  MainCtrl.$inject = ['MessagingService'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
//# sourceMappingURL=main-ctrl.js.map
