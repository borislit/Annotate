(function () {
  class MainCtrl {
    constructor(GroupsService, MessagingService, Events) {
      this.isOn = true;
      this.isInAddMode = false;
      this.GroupsService = GroupsService;
      this.MessagingService = MessagingService;
      this.Events = Events;
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

    toggle(){
      if(this.isOn){
        this.MessagingService.sendMessage(this.Events.TURN_OFF,[]);
      } else {
        this.MessagingService.sendMessage(new Event(Events.SEARCH, "sce"));
      }

      this.isOn = !this.isOn;
    }
  }

  MainCtrl.$inject = ['GroupsService', 'MessagingService', 'Events'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
