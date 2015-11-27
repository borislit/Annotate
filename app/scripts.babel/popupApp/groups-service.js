(function () {
  class GroupsService {
    constructor($http, $location, MessagingService, Events, $q) {
      this.$http = $http;
      this.$location = $location;
      this.MessagingService = MessagingService;
      this.Events = Events;
      this.asyncGroupsList = $q.defer();

      this.registerListeners();
    }

    getGroupsList() {
      console.log('Message Sent');
      this.MessagingService.sendMessage({
        event: this.Events.GROUPS_GET_LIST
      });

      return this.asyncGroupsList.promise;
    }

    getGroupAnnotations(group) {
      this.MessagingService.sendMessage({
        event: this.Events.SEARCH,
        data: group
      });
    }

    registerListeners() {
      this.MessagingService.registerListener(eventData => {
        console.log('got message', eventData);
        if (eventData.event === Events.GROUP_LIST_UPDATED) {
          console.log('Got List', eventData.data);
          this.asyncGroupsList.resolve(eventData.data);
        }
      });
    }
  }

  GroupsService.$inject = ['$http', '$location', 'MessagingService', 'Events', '$q'];

  angular.module('annotate').service('GroupsService', GroupsService);
})(angular);