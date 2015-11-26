'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MessagingService = (function () {
    function MessagingService() {
      _classCallCheck(this, MessagingService);
    }

    _createClass(MessagingService, [{
      key: 'sendMessage',
      value: function sendMessage(data) {
        chrome.runtime.sendMessage(data);
      }
    }, {
      key: 'registerListener',
      value: function registerListener(listener) {
        chrome.runtime.onMessage.addListener(listener);
      }
    }]);

    return MessagingService;
  })();

  angular.module('annotate').service('MessagingService', MessagingService);
})();
//# sourceMappingURL=messaging-service.js.map
