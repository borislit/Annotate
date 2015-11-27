(function () {
  class MainCtrl {
    constructor(GroupsService, $timeout) {
      this.GroupsService = GroupsService;
      GroupsService.getGroupsList().then((groups)=> {
        this.groups = groups;
      }).then(() => {
        $timeout(()=> {
          angular.element('.popup__group').first().click();
        })
      });
    }

    onGroupSelected(group) {
      this.GroupsService.getGroupAnnotations(group);
    }
  }

  MainCtrl.$inject = ['GroupsService', '$timeout'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
