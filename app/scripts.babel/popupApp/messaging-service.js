(function () {

  class MessagingService {
    sendMessage() {
      console.log('message sent');
      chrome.runtime.sendMessage({greeting: 'hello'}, function (response) {
        console.log(response, 'Got Back');
      });
    }
  }

  angular.module('annotate').service('MessagingService', MessagingService);

})();