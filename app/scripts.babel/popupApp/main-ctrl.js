(function () {
  class MainCtrl {
    constructor(GroupsService) {
      //GroupsService.getGroupsList().then((groups) => {
      //  this.groups = groups;
      //});
    }
  }

  MainCtrl.$inject = ['GroupsService'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
