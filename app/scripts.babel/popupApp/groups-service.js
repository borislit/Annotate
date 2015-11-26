(function () {
  class GroupsService {
    constructor($http, $location, MessagingService, Events) {
      this.$http = $http;
      this.$location = $location;
      this.MessagingService = MessagingService;
      this.Events = Events;

      this.registerListeners();

      MessagingService.sendMessage(this.Events.GROUPS_GET_LIST);
    }

    registerListeners() {
      this.MessagingService.registerListener(eventData => {
        //if (eventData.event === Events.GROUP_LIST_UPDATED) {
        console.log(eventData);
        //}
      });
    }
  }

  GroupsService.$inject = ['$http', '$location', 'MessagingService', 'Events'];

  angular.module('annotate').service('GroupsService', GroupsService);
})(angular);