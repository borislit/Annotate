(function () {

  class MessagingService {
    sendMessage(data) {
      console.log('Send Message', data);
      chrome.runtime.sendMessage(data);
    }

    registerListener(listener) {
      chrome.runtime.onMessage.addListener(listener);
    }

  }

  angular.module('annotate').service('MessagingService', MessagingService);

})();
