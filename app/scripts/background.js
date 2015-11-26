'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessagingService = (function () {
  function MessagingService() {
    _classCallCheck(this, MessagingService);
  }

  _createClass(MessagingService, null, [{
    key: 'registerListeners',
    value: function registerListeners() {
      chrome.runtime.onMessage.addListener(MessagingService.handleIncomingMessage);
    }
  }, {
    key: 'handleIncomingMessage',
    value: function handleIncomingMessage() {
      console.log('Got message');
    }
  }, {
    key: 'sendRuntimeMessage',
    value: function sendRuntimeMessage(data) {
      chrome.runtime.sendMessage(data, function (response) {
        console.log(response);
      });
    }
  }, {
    key: 'sendTabMessage',
    value: function sendTabMessage(data) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
          console.log(response);
        });
      });
    }
  }]);

  return MessagingService;
})();

MessagingService.registerListeners();

console.log('\'Allo \'Allo! Event Page for Page Action Yo');
//# sourceMappingURL=background.js.map
