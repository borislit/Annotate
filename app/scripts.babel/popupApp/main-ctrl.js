(function () {
  class MainCtrl {
    constructor(MessagingService) {
      MessagingService.sendMessage();
    }
  }

  MainCtrl.$inject = ['MessagingService'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
