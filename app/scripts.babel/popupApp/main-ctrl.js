(function () {
  class MainCtrl {
    constructor(GroupsService) {
      this.GroupsService = GroupsService;
      GroupsService.getGroupsList().then((groups)=> {
        this.groups = groups;
      });
    }

    onGroupSelected(group) {
      this.GroupsService.getGroupAnnotations(group);
    }
  }

  MainCtrl.$inject = ['GroupsService'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
