(function () {
  class GroupsService {
    constructor($http, $location) {
      this.$http = $http;
      this.$location = $location;
    }

    getGroupsList() {
      return this.$http.get('http://rest.goltsman.net/annotate/groups?uri=' + this.$location.absUrl()).then((data) => {
        return data.groups;
      });
    }
  }

  GroupsService.$inject = ['$http', '$location'];

  angular.module('annotate').service('GroupsService', GroupsService);
})(angular);