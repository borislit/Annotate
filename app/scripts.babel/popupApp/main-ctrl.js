(function () {
  class MainCtrl {
    constructor(GroupsService, $timeout) {
      this.isInAddMode = false;
      this.GroupsService = GroupsService;
      GroupsService.getGroupsList().then((groups)=> {
        this.groups = groups;
      });
    }

    onGroupSelected(group) {
      this.GroupsService.getGroupAnnotations(group);
    }

    switchToAddAddNew(){
      this.isInAddMode = true;
    }

    addGroup(group) {
      this.groups.push(group);
      this.groupToAdd = '';
      this.isInAddMode = false;
    }
  }

  MainCtrl.$inject = ['GroupsService', '$timeout'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
